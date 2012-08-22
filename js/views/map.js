
define(['Backbone','Templates'], function(Backbone, Templates){
	return Backbone.View.extend({

		initialize : function() {	
			this.mapOptions = {
	         	center: new google.maps.LatLng(10.3098, 123.893), // default cebu city
	        	zoom: 15,
	         	mapTypeId: google.maps.MapTypeId.ROADMAP,
	         	mapTypeControl: true,
			    mapTypeControlOptions: {
			      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			    },
			    zoomControl: true,
			    zoomControlOptions: {
			      style: google.maps.ZoomControlStyle.SMALL
			    },
			    panControl: false,
			    streetViewControl: false
	        };
			
			this.markers = [];
			this.currentLoc = null;
			this.geocoder = new google.maps.Geocoder();
		},

		render : function() {
			this.$el.html(
				Templates.renderMapView()
			);
			
			this.setMap();
			this.centerCurrentLocation();

			return this;
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
						self.updateModel(evt.latLng);
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
		
		updateModel : function(latLng) {
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
		
		setModel : function(model) {
			this.model = model;
		}
	});
});