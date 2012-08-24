
define(['Backbone','Templates'], function(Backbone, Templates){
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
			this.markers = [];
			this.currentLoc = null;
		},
		
		setModel : function(model) {
			this.model = model;
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
		
		prepareFor : function(view) {	
			var self = this;
			switch (view)
			{
				case "list" :
					this.clearMap();
					this.fetchRoofs();
					break;
				case "new" :
					this.clearMap();
					google.maps.event.addListener(this.map, 'click', function(evt){
						if (self.markers.length > 0)
						{
							self.markers[0].setPosition(evt.latLng);
						}
						else
						{
							self.placeMarker(evt.latLng);
						}
						self.updateRoof(evt.latLng);
					});
					break;
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
		
		placeMarker : function(latLng) {		
			var marker = new google.maps.Marker({
				position : latLng,
				map : this.map
			});
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
		
		fetchRoofs : function() {
			if (!this.model)
				return;
				
			var self = this,
				centerLoc = this.map.getCenter();
			
			this.model.fetch({
				  url : self.model.url + '/search/' + centerLoc.lat() + '/' + centerLoc.lng() + '/' + '0.01'
				, success : function(){
					console.log('fetch collection success');
					self.placeMarkers();
				}
			});
		},
		
		placeMarkers : function() {
			_.each(this.model.models, function(roof){
				this.placeMarker(new google.maps.LatLng(
					roof.get('latitude'),
					roof.get('longitude')
				));
				_.last(this.markers).setTitle(roof.get('type'));
			}, this);
		}
	});
});