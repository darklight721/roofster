
define(['$', 'exports'], function($, exports) {
	
	var   _map = null
		, _geocoder = new google.maps.Geocoder()
		, _currentLoc = null
		, _greaterBounds = null
		, _markers = [] // collection of markers for list and details view
		, _marker = null // for new and edit views
		, _selectedMarker = null // this is the bouncing marker for details view
		, _isMarkersShown = false;

	function createMarker(model)
	{
		var marker = new google.maps.Marker({
			  position : new google.maps.LatLng(model.get('latitude'), model.get('longitude'))
			, map : _map
			, title : model.get('type')
		});

		google.maps.event.addListener(marker, 'click', function(){
			console.log('marker clicked');
			window.location.href = '#roofs/' + model.get('id');
		});
		
		return marker;
	}
	
	function removeMarker(marker)
	{
		if (marker)
		{
			marker.setMap(null);
			google.maps.event.clearInstanceListeners(marker);
		}
	}

	exports.init = function() {
		_map = null;
		_currentLoc = null;
		_greaterBounds = null;
		_markers = [];
		_marker = null;
		_selectedMarker = null;
		_isMarkersShown = false;
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

	exports.addMarker = function(position) {
		_marker = new google.maps.Marker({
			  position : position
			, map : _map
			, animation : google.maps.Animation.DROP
		});
	};
		
	exports.addMarkers = function(models) {
		$.each(models, function(){
			_markers.push(createMarker(this));
			_isMarkersShown = true;
		});
	};
	
	exports.spliceMarkers = function(index, deleteCount, model) {
		if (deleteCount)
		{
			removeMarker(_markers[index]);
			_markers.splice(index, deleteCount);
		}
		else
		{
			var marker = createMarker(model);
			_markers.splice(index, deleteCount, marker);
		}
	};

	exports.clearMarker = function() {
		removeMarker(_marker);
		_marker = null;
	};

	exports.clearMarkers = function() {
		$.each(_markers, function() {
			removeMarker(this);
		});
		_markers = [];
		_isMarkersShown = false;
	};
	
	exports.setMarkerPos = function(position) {
		if (_marker)
		{
			_marker.setPosition(position);
		}
		else
		{
			this.addMarker(position);
		}
	};

	exports.selectMarker = function(index) {
		console.log(index);
		if (index > -1)
		{
			this.removeSelectedMarker();
			_selectedMarker = _markers[index];
			_selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
		}
	};
	
	exports.removeSelectedMarker = function() {
		if (_selectedMarker)
		{
			_selectedMarker.setAnimation(null);
		}
	};

	exports.toggleMarkers = function(isShow) {
		if (_isMarkersShown === isShow) return;
		
		$.each(_markers, function(){
			this.setMap(isShow ? _map : null);
		});
		
		_isMarkersShown = isShow;
	};

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

});