
define(['MarkerView', 'exports'], function(MarkerView, exports) {
	
	var   _map = null
		, _geocoder = new google.maps.Geocoder()
		, _currentLoc = null
		, _greaterBounds = null
		, _movableMarkerView = null // for new and edit views
		, _markerViews = [] // collection of markers for list and details view
		, _selectedMarker = null; // this is the bouncing marker for details view
		
	function createMarker(model, options)
	{
		return new MarkerView({
			  model : model
			, map : _map
			, options : options
		}).render();
	}
	
	function removeMarker(markerView)
	{
		if (markerView)
		{
			markerView.remove();
		}
	}

	exports.init = function() {
		_map = null;
		_currentLoc = null;
		_greaterBounds = null;
		
		this.removeMovableMarker();
		this.removeMarkers();
		
		_selectedMarker = null;	
	};

	exports.setMap = function(map) {
		_map = map;
	};
	
	exports.setMapSize = function(mapElem) {
		var height = $(window).innerHeight() - 80;
		if (height < 600) 
			height = 600;
		else if (height > 1000)
			height = 1000;
		mapElem.height(height);
	};
	
	// helpers for movable marker start here

	exports.createMovableMarker = function(model) {
		_movableMarkerView = createMarker(model, { noClick : true });
	};
	
	exports.removeMovableMarker = function() {
		removeMarker(_movableMarkerView);
		_movableMarkerView = null;
	};
	
	// helpers for markers (for details and list views) start here
	
	exports.pushMarker = function(model) {
		_markerViews.push(createMarker(model));
	};
		
	exports.pushMarkers = function(models) {
		_.each(models, this.pushMarker);
	};
	
	exports.removeMarkers = function() {
		_.each(_markerViews, removeMarker);
		_markerViews = [];
	};
	
	exports.selectMarker = function(modelId) {
		this.removeSelectedMarker();
		
		_selectedMarker = _.find(_markerViews, function(markerView){
			return markerView.model.get('id') === modelId;
		});

		if (_selectedMarker)
		{
			_selectedMarker.select(true);
			return true;
		}
		
		return false;
	};
	
	exports.removeSelectedMarker = function() {
		if (_selectedMarker)
		{
			_selectedMarker.select(false);
			_selectedMarker = null;
		}
	};

	exports.toggleMarkers = function(isShown) {
		_.each(_markerViews, function(markerView){
			markerView.toggle(isShown);
		});
	};
	
	// helpers for latlngbounds start here
	
	exports.setGreaterBounds = function(bounds) {
		_greaterBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(
				bounds.from.lat,
				bounds.from.lng
			),
			new google.maps.LatLng(
				bounds.to.lat,
				bounds.to.lng
			)
		);
	};
	
	exports.isMapInBounds = function(mapBounds) {
		var ret = false;
		if (_greaterBounds && mapBounds)
		{
			if (_greaterBounds.contains(mapBounds.getSouthWest()) && _greaterBounds.contains(mapBounds.getNorthEast()))
			{
				ret = true;
			}
		}
		return ret;
	};
	
	exports.hasGreaterBounds = function() {
		return (_greaterBounds !== null);
	};
	
	// other helpers

	exports.getAddress = function(latLng, callback) {
		_geocoder.geocode(
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
	};
	
	exports.centerCurrentLocation = function(callback) {
		if (!_currentLoc)
		{
			if (navigator.geolocation)
			{
				var self = this;
				navigator.geolocation.getCurrentPosition(
					function(position){
						_currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						_map.setCenter(_currentLoc);
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
			_map.setCenter(_currentLoc);
			if (callback) callback();
		}
	};
});