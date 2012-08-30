
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
		if (!this.roofs)
		{
			this.roofs = new Roofs();
		}
					
		this.mapView.prepareFor(SideViews.LIST, this.roofs);
		
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
		
		this.mapView.prepareFor(SideViews.NEW, this.roof);
	};

	views[SideViews.DETAILS] = function(modelId) {
		if (!modelId) return;

		var self = this;
		// helper
		var prepareDetails = function() {
			self.assign(new GenericView({
				template : Templates.renderDetailsView(),
				data : self.roof.toJSON()
			}), '.side-div');

			self.mapView.prepareFor(SideViews.DETAILS, self.roof);
		};

		if (this.roof && this.roof.get('id') === modelId)
		{
			console.log('add + details');
			prepareDetails();
		}
		else
		{				
			this.roof = new Roof({ id : modelId });
				
			this.roof.fetch({ success : function(model, response){
				if (!response) return;

				if (self.roof.has('pictures'))
				{
					self.roof.set({
						pictures : JSON.parse(self.roof.get('pictures'))
					});
				}
				prepareDetails();
			}});
		}
	};

	views[SideViews.EDIT] = function(modelId) {
		if (!modelId) return;

		var self = this;

		var prepareEdit = function() {
			if (!self.newView)
			{
				self.newView = new NewView();
			}
			self.newView.setModel(self.roof);
			self.assign(self.newView, '.side-div');
			
			self.mapView.prepareFor(SideViews.NEW, self.roof);
		};

		if (this.roof && this.roof.get('id') === modelId)
		{
			prepareEdit();
		}
		else
		{
			console.log(modelId);
			this.roof = new Roof({ id : modelId });

			this.roof.fetch({ success : function(model, response){
				if (!response) return;

				if (self.roof.has('pictures'))
				{
					self.roof.set({
						pictures : JSON.parse(self.roof.get('pictures'))
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