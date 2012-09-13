
define(function(require){
	var   Backbone = require('Backbone')
		// models
		, Roof = require('Roof')
		, Roofs = require('Roofs')
		// views
		, Templates = require('Templates')
		, MapView = require('MapView')
		, ListView = require('ListView')
		, FormView = require('FormView')
		, GenericView = require('GenericView')
		, SideViews = require('SideViews');

	// private members
	var   homeView = null // this is just a reference to backbone view object, this is set when the backbone view is initialized.
		, roofSavedAttr = {} // holds a copy of the saved attributes of a roof
		, views = {};

	views[SideViews.LIST] = function(unused) {
		if (!homeView.listView)
		{
			homeView.listView = new ListView({ model : homeView.roofs });
		}
		homeView.assign(homeView.listView, '.side-div');
		
		homeView.mapView.setMapView(SideViews.LIST);
	};

	views[SideViews.NEW] = function(unused) {
		createRoof();
					
		if (!homeView.formView)
		{
			homeView.formView = new FormView();
		}
		homeView.formView.setModel(homeView.roof);
		homeView.assign(homeView.formView, '.side-div');
		
		homeView.mapView.setMapView(SideViews.NEW, homeView.roof);
	};

	views[SideViews.DETAILS] = function(modelId) {
		if (!modelId) return;
		
		var prepareDetails = function() {
			// render view
			homeView.assign(new GenericView({
				template : Templates.renderDetailsView(),
				data : homeView.roof.toJSON()
			}), '.side-div');

			homeView.mapView.setMapView(SideViews.DETAILS, homeView.roof);
		};
		
		if (homeView.roof && homeView.roof.get('id') === modelId)
		{
			homeView.roof.set(roofSavedAttr);
			prepareDetails();
		}
		else
		{
			createRoof({ id : modelId });
			fetchRoof(prepareDetails);
		}
	};

	views[SideViews.EDIT] = function(modelId) {
		if (!modelId) return;

		var prepareEdit = function() {
			if (!homeView.formView)
			{
				homeView.formView = new FormView();
			}
			homeView.formView.setModel(homeView.roof);
			homeView.assign(homeView.formView, '.side-div');
			
			homeView.mapView.setMapView(SideViews.NEW, homeView.roof);
		};

		if (homeView.roof && homeView.roof.get('id') === modelId)
		{
			prepareEdit();
		}
		else
		{
			createRoof({ id : modelId });
			fetchRoof(prepareEdit);
		}
	};
	
	function createRoof(attr)
	{
		// remove previously attached events
		if (homeView.roof)
			homeView.roof.off();
			
		homeView.roof = new Roof(attr);
		
		homeView.roof.on('saved', function(){
			var roof = homeView.roofs.get(
				homeView.roof.get('id')
			);

			if (roof)
			{
				roof.set(homeView.roof.toJSON());
			}
			else
			{
				if (homeView.roofs.hasFilter())
				{
					homeView.roofs.resetFilter();
				}
				homeView.roofs.push(homeView.roof.clone());
			}
			
			// save orig attributes
			roofSavedAttr = homeView.roof.toJSON();
		});
		
		homeView.roof.on('removed', function(){
			var roof = homeView.roofs.get(
				homeView.roof.get('id')
			);
			
			if (roof)
			{
				roof.trigger('remove');
				homeView.roofs.remove(roof);
			}
		});
	}

	function fetchRoof(callback)
	{
		if (!homeView.roof) return;
		
		homeView.roof.fetch({ success : function(model, response){
			if (!response) return;

			if (homeView.roof.has('pictures'))
			{
				homeView.roof.set({
					pictures : JSON.parse(homeView.roof.get('pictures'))
				});
			}
			
			// save orig attributes
			roofSavedAttr = homeView.roof.toJSON();
			
			if (callback) callback();
		}});
	}

	return Backbone.View.extend({

		className: 'row',

		initialize : function() {
			console.log('home initialize');
			
			// models
			this.roof = null;
			this.roofs = new Roofs();
			
			// views
			this.mapView = new MapView({
				roofs : this.roofs
			});
			this.template = Templates.renderHomeView();
			this.render();

			homeView = this;
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			this.assign(this.mapView, '.map-div');
			return this;
		},

		setSideView : function(sideView, modelId) {
			if (views[sideView])
			{
				views[sideView](modelId);
			}
		}

	});
});