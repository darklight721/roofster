
define(['Backbone','Templates'], function(Backbone, Templates){
	return Backbone.View.extend({

		initialize : function() {

			this.mapOptions = {
	         	center: new google.maps.LatLng(-34.397, 150.644),
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
		},

		render : function() {
			this.$el.html(
				Templates.renderMapView()
			);

			if (navigator.geolocation)
			{
				var self = this;
				navigator.geolocation.getCurrentPosition(
					function(position){
						self.mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						self.setMap();
					},
					function() {
						self.setMap();
					}
				);
			}
			else
			{
				this.setMap();
			}

			
			return this;
		},

		setMap : function() {
			this.map = new google.maps.Map(this.$('.map-tile')[0], this.mapOptions);
		}

	});
});