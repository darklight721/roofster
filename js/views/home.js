
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
		, views = {};

	views[SideViews.LIST] = function(unused) {
		if (!homeView.roofs)
		{
			homeView.roofs = new Roofs();
		}
					
		homeView.mapView.setMapView(SideViews.LIST, homeView.roofs);
		
		if (!homeView.listView)
		{
			homeView.listView = new ListView();
		}
		homeView.assign(homeView.listView, '.side-div');
	};

	views[SideViews.NEW] = function(unused) {
		homeView.roof = new Roof();
					
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

		var prepareDetails = function(options) {
			homeView.assign(new GenericView({
				template : Templates.renderDetailsView(),
				data : homeView.roof.toJSON()
			}), '.side-div');

			homeView.mapView.setMapView(SideViews.DETAILS, homeView.roof, options);
		};

		var options = {};
		if (homeView.roof && homeView.roof.get('id') === modelId)
		{
			options.force = true;
		}
		
		homeView.roof = new Roof({ id : modelId });
			
		homeView.roof.fetch({ success : function(model, response){
			if (!response) return;

			if (homeView.roof.has('pictures'))
			{
				homeView.roof.set({
					pictures : JSON.parse(homeView.roof.get('pictures'))
				});
			}
			prepareDetails(options);
		}});
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
			homeView.roof = new Roof({ id : modelId });
				
			homeView.roof.fetch({ success : function(model, response){
				if (!response) return;

				if (homeView.roof.has('pictures'))
				{
					homeView.roof.set({
						pictures : JSON.parse(homeView.roof.get('pictures'))
					});
				}
				prepareEdit();
			}});
		}
	};

	return Backbone.View.extend({

		className: 'row',

		initialize : function() {
			console.log('home initialize');
			this.template = Templates.renderHomeView();
			this.mapView = new MapView();
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