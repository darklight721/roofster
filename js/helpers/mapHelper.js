
define(['$'], function($) {
	
	var   _map = null
		, _geocoder = new google.maps.Geocoder();
		, _markers = []; // collection of markers for list and details view
		, _marker = null; // for new and edit views
		, _selectedMarker = null; // this is the bouncing marker for details view

	function init()
	{
		_map = null;
		_markers = [];
		_marker = null;
		_selectedMarker = null;
	}

	function setMap(map)
	{
		_map = map;
	}

	function addMarker(model)
	{
		_marker = new google.maps.Marker({
			  position : new google.maps.LatLng(model.get('latitude'), model.get('longitude'))
			, map : _map
			, animation : google.maps.Animation.DROP
		});
	}
		
	function addMarkers(models) 
	{
		$.each(models, function(){
			var marker = new google.maps.Marker({
				  position : new google.maps.LatLng(this.get('latitude'), this.get('longitude'))
				, map : _map
				, title : this.get('type')
			});

			google.maps.event.addListener(marker, 'click', function(){
				console.log('marker clicked');
				window.location.href = '#roofs/' + this.get('id');
			});

			_markers.push(this);
		});
	}

	function clearMarker() 
	{
		if (_marker)
		{
			_marker.setMap(null);
			google.maps.event.clearInstanceListeners(_marker);
			_marker = null;
		}
	}

	function clearMarkers() 
	{
		$.each(_markers, function() {
			google.maps.event.clearInstanceListeners(this);
			this.setMap(null);
		});
		_markers = [];
	}

	function selectMarker(index)
	{
		if (index > -1)
		{
			if (_selectedMarker)
			{
				_selectedMarker.setAnimation(null);
			}
			_selectedMarker = _markers[index];
			_selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

	function toggleMarkers(isShow) 
	{
		$.each(_markers, function(){
			this.setMap(isShow ? _map : null);
		});
	}

	function getAddress(latLng, callback) 
	{
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
	}

	return {
		  init : init
		, setMap : setMap
		, addMarker : addMarker
		, addMarkers : addMarkers
		, clearMarker : clearMarker
		, clearMarkers : clearMarkers
		, selectMarker : selectMarker
		, toggleMarkers : toggleMarkers
		, findAddress : findAddress
	};

});