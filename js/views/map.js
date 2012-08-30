
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates')
		, Roofs = require('Roofs')
		, SideViews = require('SideViews');

	function setMapSize(mapElem) {
		var height = $(window).innerHeight() - 80;
		if (height < 600) 
			height = 600;
		else if (height > 1000)
			height = 1000;
		mapElem.height(height);
	}

	var views = {};
	
	views[SideViews.LIST] = function(model) {
		this.clearMarker(); // clear marker from new/edit view
		this.clearMapEvents();

		if (!this.roofs)
		{
			this.roofs = model;
			this.setMapEvents();

			var self = this;
			this.centerCurrentLocation(function(){
				self.fetchRoofs();
			});
		}
		else
		{
			this.setMapEvents();
			this.toggleMarkers(true);
		}
	};

	views[SideViews.NEW] = function(model) {
		if (!model) return;
		this.roof = model;

		this.clearMarker(); // clear marker from new/edit view
		this.clearMapEvents();
		this.toggleMarkers(false); // hide markers 
		
		// if model has already a latlng, pin that on the map and center it.
		if (this.roof.get('latitude') || this.roof.get('longitude'))
		{
			var position = new google.maps.LatLng(this.roof.get('latitude'), this.roof.get('longitude'));
			this.marker = new google.maps.Marker({
				  position : position
				, map : this.map
				, animation : google.maps.Animation.DROP
			});
			this.map.panTo(position);
			//this.map.setCenter(position);
		}
		else
		{
			if (!this.roofs)
				this.centerCurrentLocation();
		}

		var self = this;
		google.maps.event.addListener(this.map, 'click', function(evt){
			if (self.marker)
			{
				self.marker.setPosition(evt.latLng);
			}
			else
			{
				self.marker = new google.maps.Marker({
					  position : evt.latLng
					, map : self.map
					, animation : google.maps.Animation.DROP
				});
			}
			self.updateRoof(evt.latLng);
		});
	};

	views[SideViews.DETAILS] = function(model) {
		if (!model) return;

		this.clearMarker(); // clear marker from new/edit view
		this.clearMapEvents();

		// if the passed model is in the collection
		if (this.roofs)
		{
			var roof = this.roofs.where({
				id : model.get('id')
			});

			if (roof.length > 0)
			{
				var mapBounds = this.map.getBounds();
				var latLng = new google.maps.LatLng(
					model.get('latitude'),
					model.get('longitude')
				);

				if (mapBounds.contains(latLng)) 
				{
					this.setMapEvents();
					this.toggleMarkers(true);
					this.selectMarker(model.get('id'));
					return;
				}
			}
		}
		else
		{
			this.roofs = new Roofs();
		}
		
		this.setMapEvents();

		//this.map.setCenter(new google.maps.LatLng(
		this.map.panTo(new google.maps.LatLng(
			model.get('latitude'),
			model.get('longitude')
		));

		var self = this;
		this.fetchRoofs(function(){
			self.selectMarker(model.get('id'));
		});
	};

	return Backbone.View.extend({

		initialize : function() {	
			this.template = Templates.renderMapView();
			
			this.mapOptions = {
	         	  center : new google.maps.LatLng(10.3098, 123.893) // default cebu city
	        	, zoom : 16
	         	, mapTypeId : google.maps.MapTypeId.ROADMAP
	         	, mapTypeControl : true
			    , mapTypeControlOptions : {
					style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
				  }
			    , zoomControl : true
			    , zoomControlOptions : {
					style : google.maps.ZoomControlStyle.SMALL
			      }
			    , panControl : false
			    , streetViewControl : false
	        };
			this.geocoder = new google.maps.Geocoder();
			this.markers = []; // collection of markers for list and details view
			this.marker = null; // for new and edit views
			this.selectedMarker = null; // this is the bouncing marker for details view
			this.currentLoc = null; // stores the returned value of geolocation.getcurrentposition
			this.latLngBounds = null;
			this.bounds = 0.01;
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			
			var mapElem = this.$('.map-tile');
			setMapSize(mapElem);
			this.map = new google.maps.Map(mapElem[0], this.mapOptions);

			return this;
		},
		
		prepareFor : function(view, model) {	
			if (views[view])
			{
				views[view].call(this, model);
			}
		},

		centerCurrentLocation : function(callback) {
			if (!this.currentLoc)
			{
				if (navigator.geolocation)
				{
					var self = this;
					navigator.geolocation.getCurrentPosition(
						function(position){
							self.currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							self.map.setCenter(self.currentLoc);
							if (callback) callback();
						},
						function(){
							if (callback) callback();
						}
					);
				}
				else
				{
					if (callback) callback();
				}
			}
			else
			{
				this.map.setCenter(this.currentLoc);
				if (callback) callback();
			}
		},

		selectMarker : function(modelId) {
			var ids = this.roofs.pluck('id');
			var index = _.indexOf(ids, modelId);

			if (index > -1)
			{
				if (this.selectedMarker)
				{
					this.selectedMarker.setAnimation(null);
				}
				this.selectedMarker = this.markers[index];
				this.selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
			}
		},
		
		toggleMarkers : function(isShow) {
			_.each(this.markers, function(marker){
				marker.setMap(isShow ? this.map : null);
			}, this);
		},
		
		clearMarker : function() {
			if (this.marker)
			{
				this.marker.setMap(null);
				google.maps.event.clearInstanceListeners(this.marker);
				this.marker = null;
			}
		},
		
		setMapEvents : function() {
			var self = this;
			google.maps.event.addListener(this.map, 'dragend', function(){
				self.fetchRoofs();
			});
		},
		
		clearMapEvents : function() {
			google.maps.event.clearInstanceListeners(this.map);
		},
		
		updateRoof : function(latLng) {
			// save to model
			if (this.roof)
			{
				this.roof.set({
					latitude : latLng.lat(),
					longitude : latLng.lng()
				});
				
				var self = this;
				this.getAddress(latLng, function(address){
					self.roof.set({
						address : address
					});
				});
			}
		},
		
		getAddress : function(latLng, callback) {
			this.geocoder.geocode(
				{ 'latLng' : latLng },
				function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) 
					{
						if (results[0] && callback) 
						{
							callback(results[0].formatted_address);
						}
					}
				}
			);
		},
		
		fetchRoofs : function(callback) {
			if (!this.roofs)
				return;
			
			var mapBounds = this.map.getBounds();			
			if (this.latLngBounds)
			{
				if (this.latLngBounds.contains(mapBounds.getSouthWest()) && this.latLngBounds.contains(mapBounds.getNorthEast()))
				{
					if (callback) callback();
					return;
				}
			}
				
			var bounds_data = {
				from : {
					lat : mapBounds.getSouthWest().lat() - this.bounds,
					lng : mapBounds.getSouthWest().lng() - this.bounds
				},
				to : {
					lat : mapBounds.getNorthEast().lat() + this.bounds,
					lng : mapBounds.getNorthEast().lng() + this.bounds
				}
			};
			
			this.latLngBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(
					bounds_data.from.lat,
					bounds_data.from.lng
				),
				new google.maps.LatLng(
					bounds_data.to.lat,
					bounds_data.to.lng
				)
			);
			
			console.log(bounds_data);
			var self = this;
			this.roofs.fetch({
				  data : bounds_data
				, success : function(){
					console.log('fetch collection success');
					self.clearMarkers();
					self.placeMarkers();
					if (callback) callback();
				}
			});
		},
		
		clearMarkers : function() {
			_.each(this.markers, function(marker) {
				google.maps.event.clearInstanceListeners(marker);
				marker.setMap(null);
			});
			this.markers = [];
		},
		
		placeMarkers : function() {
			_.each(this.roofs.models, function(roof){
				var marker = new google.maps.Marker({
					  position : new google.maps.LatLng(roof.get('latitude'), roof.get('longitude'))
					, map : this.map
					, title : roof.get('type')
				});

				google.maps.event.addListener(marker, 'click', function(){
					console.log('marker clicked');
					//window.app.navigate('roofs/' + roof.get('id'));
					window.location.href = '#roofs/' + roof.get('id');
				});

				this.markers.push(marker);
			}, this);
		}
	});
});