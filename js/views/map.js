
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates')
		, Roofs = require('Roofs')
		, SideViews = require('SideViews');

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
			this.currentLoc = null;
			this.currentMarker = null;
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			
			this.setSize();
			this.setMap();
			this.centerCurrentLocation();

			return this;
		},
		
		setSize : function() {
			var height = $(window).innerHeight() - 80;
			if (height < 600) 
				height = 600;
			else if (height > 1000)
				height = 1000;
			this.$('.map-tile').height(height);
		},

		setMap : function() {
			this.map = new google.maps.Map(this.$('.map-tile')[0], this.mapOptions);
		},
		
		centerCurrentLocation : function() {
			if (!this.currentLoc)
			{
				if (navigator.geolocation)
				{
					var self = this;
					navigator.geolocation.getCurrentPosition(
						function(position){
							self.currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							self.map.setCenter(self.currentLoc);
						}
					);
				}
			}
			else
			{
				this.map.setCenter(this.currentLoc);
			}
		},
		
		prepareFor : function(view, model) {	
			var self = this;
			switch (view)
			{
				case "list" :
					this.model = model;
					this.clearMap();
					this.fetchRoofs();
					break;
				case "new" :
					this.model = model;
					this.hideMarkers();
					this.clearMarker();
					if (this.model.get('latitude') || this.model.get('longitude'))
					{
						this.marker = new google.maps.Marker({
							  position : new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude'))
							, map : this.map
							, animation : google.maps.Animation.DROP
						});
					}
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
					break;
				case "details" :
					if (this.model && this.model.models) // check if model is a collection
					{
						var roofs = this.model.where({
							id : model.get('id')
						});

						if (roofs.length > 0)
						{
							var mapBounds = this.map.getBounds();
							var latLng = new google.maps.LatLng(
								model.get('latitude'),
								model.get('longitude')
							);

							if (!mapBounds.contains(latLng)) 
							{
								this.map.setCenter(latLng);
							}

							this.animateMarker(model.get('id'));
							return;
						}
					}
					else if (this.model)
					{
						this.clearMarker();
					}

					this.model = new Roofs();

					this.map.setCenter(new google.maps.LatLng(
						model.get('latitude'),
						model.get('longitude')
					));

					this.fetchRoofs(function(){
						self.animateMarker(model.get('id'));
					});

					break;
			}
		},

		animateMarker : function(modelId) {
			var ids = this.model.pluck('id');
			var index = _.indexOf(ids, modelId);

			if (index > -1)
			{
				if (this.currentMarker)
				{
					this.currentMarker.setAnimation(null);
				}
				this.currentMarker = this.markers[index];
				this.currentMarker.setAnimation(google.maps.Animation.BOUNCE);
			}
		},
		
		hideMarkers : function() {
			_.each(this.markers, function(marker){
				marker.setMap(null);
			});
		},
		
		clearMarker : function() {
			if (this.marker)
			{
				this.marker.setMap(null);
				google.maps.event.clearInstanceListeners(this.marker);
				this.marker = null;
			}
		},
		
		clearMap : function() {
			_.each(this.markers, function(marker) {
				google.maps.event.clearInstanceListeners(marker);
				marker.setMap(null);
			});
			this.markers = [];
			
			google.maps.event.clearInstanceListeners(this.map);
		},
		
		placeMarker : function(latLng, options) {		
			var markerOptions = {
				position : latLng,
				map : this.map
			};
			if (options)
			{
				markerOptions = _.extend(markerOptions, options);
			}
			
			var marker = new google.maps.Marker(markerOptions);
			this.markers.push(marker);
		},
		
		updateRoof : function(latLng) {
			// save to model
			if (this.model)
			{
				this.model.set({
					latitude : latLng.lat(),
					longitude : latLng.lng()
				});
				
				var self = this;
				this.getAddress(latLng, function(address){
					self.model.set({
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
			if (!this.model)
				return;
				
			var self = this,
				centerLoc = this.map.getCenter();

			console.log(this.model.url);
			
			this.model.fetch({
				  url : self.model.url + '/search/' + centerLoc.lat() + '/' + centerLoc.lng() + '/' + '0.01'
				, success : function(){
					console.log('fetch collection success');
					self.placeMarkers();
					if (callback) callback();
				}
			});
		},
		
		placeMarkers : function() {
			_.each(this.model.models, function(roof){
				this.placeMarker(new google.maps.LatLng(
					roof.get('latitude'),
					roof.get('longitude')
				));
				var marker = _.last(this.markers);
				marker.setTitle(roof.get('type'));

				google.maps.event.addListener(marker, 'click', function(){
					console.log('marker clicked');
					//window.app.navigate('roofs/' + roof.get('id'));
					window.location.href = '#roofs/' + roof.get('id');
				});
			}, this);
		}
	});
});