
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates')
		, Roofs = require('Roofs')
		, SideViews = require('SideViews')
		, MapHelper = require('MapHelper');

	// constants
	var BOUNDS = 0.01;
	
	// private members
	var   mapView = null // this is just a reference to backbone view object, this is set when the backbone view is initialized.
		, views = {};
	
	views[SideViews.LIST] = function(model) {
		showFilters();
		MapHelper.removeMovableMarker(); // clear marker from new/edit view
		MapHelper.removeSelectedMarker(); // clear selected marker from details view
		MapHelper.toggleMarkers(true);
		
		clearMapEvents();
		setMapEvents(SideViews.LIST);
		
		if (MapHelper.hasGreaterBounds()) // if map's been positioned already
		{
			fetchRoofs();
		}
		else
		{
			MapHelper.centerCurrentLocation(function(){
				fetchRoofs();
			});
		}
	};

	views[SideViews.NEW] = function(model) {
		if (!model) return;
		mapView.roof = model;

		hideFilters();
		MapHelper.removeMovableMarker(); // clear marker from new/edit view
		MapHelper.removeSelectedMarker(); // clear selected marker from details view
		MapHelper.toggleMarkers(false); // hide markers from list view
		
		clearMapEvents();
		setMapEvents(SideViews.NEW);
		
		MapHelper.createMovableMarker(mapView.roof);
		
		// if model has already a latlng, pin that on the map and center it.
		if (mapView.roof.get('latitude') || mapView.roof.get('longitude'))
		{
			mapView.map.panTo(new google.maps.LatLng(
				mapView.roof.get('latitude'), 
				mapView.roof.get('longitude')
			));
		}
		else if (!MapHelper.hasGreaterBounds())
		{
			MapHelper.centerCurrentLocation();
		}
	};

	views[SideViews.DETAILS] = function(model) {
		if (!model) return;

		showFilters();
		MapHelper.removeMovableMarker(); // clear marker from new/edit view
		MapHelper.toggleMarkers(true);
		
		clearMapEvents();
		setMapEvents(SideViews.LIST);
		
		var roofLoc = new google.maps.LatLng(
			model.get('latitude'),
			model.get('longitude')
		);

		// if the passed model is in the collection
		if (mapView.roofs.get(model.get('id')))
		{
			var mapBounds = mapView.map.getBounds();
			if (mapBounds.contains(roofLoc)) 
			{
				var found = MapHelper.selectMarker(model.get('id'));
				if (found) return;
			}
		}

		MapHelper.setSelectedId(model.get('id'));

		mapView.map.panTo(roofLoc);
		fetchRoofs({ force : true });
	};
	
	function setMapEvents(view) 
	{	
		if (view === SideViews.LIST)
		{
			google.maps.event.addListener(mapView.map, 'dragend', function(){
				fetchRoofs();
			});
		}
		else if (view === SideViews.NEW)
		{
			google.maps.event.addListener(mapView.map, 'click', function(evt){
				updateRoof(evt.latLng);
			});
		}
		
		mapView.delegateEvents();
	}
	
	function clearMapEvents() 
	{
		google.maps.event.clearInstanceListeners(mapView.map);
	}
	
	function showFilters()
	{
		mapView.$('div.filter-ctrl').show();
	}
	
	function hideFilters()
	{
		mapView.$('div.filter-ctrl').hide();
	}

	function updateRoof(latLng) 
	{
		// save to model
		if (mapView.roof)
		{
			mapView.roof.set({
				latitude : latLng.lat(),
				longitude : latLng.lng()
			});
			
			MapHelper.getAddress(latLng, function(address){
				mapView.roof.set({
					address : address
				});
			});
		}
	}
	
	function fetchRoofs(options) 
	{
		if (!mapView.roofs)
			return;
		
		var mapBounds = mapView.map.getBounds();			
		if (!(options && options.force) && MapHelper.isMapInBounds(mapBounds))
		{
			// no need to fetch roofs if mapbounds is still inside the greater bounds
			return;
		}
			
		var bounds_data = {
			from : {
				lat : mapBounds.getSouthWest().lat() - BOUNDS,
				lng : mapBounds.getSouthWest().lng() - BOUNDS
			},
			to : {
				lat : mapBounds.getNorthEast().lat() + BOUNDS,
				lng : mapBounds.getNorthEast().lng() + BOUNDS
			}
		};
		MapHelper.setGreaterBounds(bounds_data);
		
		mapView.roofs.fetch({
			  data : bounds_data
			, success : function(){
				console.log('fetch collection success');
				var selectedId = MapHelper.getSelectedId();
				if (selectedId !== -1)
				{
					MapHelper.selectMarker(selectedId);
				}
			}
		});
	}

	function addMarker(evt, models, options)
	{
		console.log('a roof is added at index ' + options.index);
		var roof = mapView.roofs.at(options.index);
		if (roof)
		{
			MapHelper.pushMarker(roof);
		}
	}

	function resetFilters()
	{
		mapView.$('div.filter-ctrl').children().removeClass('active');
		mapView.renderMarkers();
	}

	return Backbone.View.extend({

		initialize : function(options) {
			mapView = this;
			MapHelper.init();

			this.roofs = options.roofs;
			this.roofs.on('add', addMarker);
			this.roofs.on('reset filter', this.renderMarkers, this);
			this.roofs.on('filter:reset', resetFilters);
			
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
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			
			var mapElem = this.$('.map-tile');
			MapHelper.setMapSize(mapElem);
			this.map = new google.maps.Map(mapElem[0], this.mapOptions);
			MapHelper.setMap(this.map);
			
			return this;
		},

		renderMarkers : function() {
			MapHelper.removeMarkers();
			MapHelper.pushMarkers(this.roofs.getModels());
		},
		
		setMapView : function(view, model) {	
			if (views[view])
			{
				views[view](model);
			}
		},

		events : {
			'click button.filter' : 'applyFilter',
			'change input.search' : 'searchAddress'
		},

		applyFilter : function(evt) {
			var $el = this.$(evt.target);
			$el.toggleClass('active');

			var filters = [];
			$el.parent().children('button.filter.active').each(function(){
				filters.push($(this).data('filter'));
			});
			if (filters.length === $el.parent().children('button.filter').length)
			{
				filters = [];
			}
			
			this.roofs.setFilter($el.data('attr'), filters);
		},
		
		searchAddress : function(evt) {
			var self = this;
			MapHelper.getLatLngPos(evt.target.value, function(position){
				if (position)
				{
					//self.map.setCenter(position);
					self.map.panTo(position);
					fetchRoofs();
				}
			});
		}
	});
});