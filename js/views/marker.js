
define(['Backbone'], function(Backbone){

	return Backbone.View.extend({
	
		initialize : function(options) {
			this.map = options.map;
			this.options = options.options;
			this.isShown = false;
			this.isSelected = false;
			
			this.marker = new google.maps.Marker({
				  position : new google.maps.LatLng(
					this.model.get('latitude') || 0, 
					this.model.get('longitude') || 0
				  )
				, title : this.model.get('type')
			});
			
			this.setMarkerEvent();	
			this.model.on('change:latitude change:longitude', this.changePosition, this);
			this.model.on('remove', this.remove, this);
		},
		
		render : function() {
			this.toggle(true);
			return this;
		},
		
		toggle : function(isShown) {
			if (!this.marker) return;

			if (this.isShown !== isShown)
			{
				this.marker.setMap(isShown ? this.map : null);
				this.isShown = isShown;
			}
		},
		
		select : function(isSelected) {
			if (!this.marker) return;

			if (this.isSelected !== isSelected)
			{
				this.marker.setAnimation(isSelected ? google.maps.Animation.BOUNCE : null);
				this.isSelected = isSelected;
			}
		},
		
		changePosition : function() {
			console.log('position changed.');
			if (!this.marker) return;

			this.marker.setPosition(
				new google.maps.LatLng(
					this.model.get('latitude'),
					this.model.get('longitude')
				)
			);
		},
		
		remove : function() {
			if (!this.marker) return;

			this.toggle(false);
			google.maps.event.clearInstanceListeners(this.marker);
			this.marker = null;		
			this.map = null;
		},
		
		setMarkerEvent : function() {
			if (!this.marker) return;

			var self = this;
			
			if (!(this.options && this.options.noClick))
			{
				google.maps.event.addListener(this.marker, 'click', function(){
					console.log('marker clicked');
					window.location.href = '#roofs/' + self.model.get('id');
				});
			}
		}
		
	});

});