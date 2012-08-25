
define(function(require){
	var   Backbone = require('Backbone')
		// models
		, Roof = require('Roof')
		, Roofs = require('Roofs')
		// views
		, Templates = require('Templates')
		, MapView = require('MapView')
		, ListView = require('ListView')
		, NewView = require('NewView')
		, GenericView = require('GenericView')
		, SideViews = require('SideViews');

	var views = {};
	
	views[SideViews.LIST] = function(unused) {
		var roofs = new Roofs();
					
		this.mapView.prepareFor('list', roofs);
		
		if (!this.listView)
		{
			this.listView = new ListView();
		}
		this.assign(this.listView, '.side-div');
	};

	views[SideViews.NEW] = function(unused) {
		this.roof = new Roof();
					
		if (!this.newView)
		{
			this.newView = new NewView();
		}
		this.newView.setModel(this.roof);
		this.assign(this.newView, '.side-div');
		
		this.mapView.prepareFor('new', this.roof);
	};

	views[SideViews.DETAILS] = function(modelId) {
		if (!modelId) return;

		var self = this;
		// helper
		var prepareDetails = function(roof) {
			if (roof.has('pictures'))
			{
				roof.set({
					pictures : JSON.parse(roof.get('pictures'))
				});
			}
		
			self.assign(new GenericView({
				template : Templates.renderDetailsView(),
				data : roof.toJSON()
			}), '.side-div');

			self.mapView.prepareFor('details', roof);
		};

		if (this.roof && this.roof.get('id') === modelId)
		{
			console.log('add + details');
			prepareDetails(this.roof);
		}
		else
		{				
			var roof = new Roof({ id : modelId });
				
			roof.fetch({ success : function(model, response){
				if (!response) return;
				prepareDetails(roof);
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
				views[sideView].call(this, modelId);
			}
		}

	});
});