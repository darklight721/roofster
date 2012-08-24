
define(function(require){
	var   Backbone = require('Backbone')
		, Roof = require('Roof')
		, Roofs = require('Roofs')
		, Templates = require('Templates')
		, MapView = require('MapView')
		, ListView = require('ListView')
		, NewView = require('NewView')
		, GenericView = require('GenericView');

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

		setSideView : function(view, id) {
			switch (view)
			{
				case "list" :
					var roofs = new Roofs();
					
					this.mapView.prepareFor('list', roofs);
					
					if (!this.listView)
					{
						this.listView = new ListView();
					}
					this.assign(this.listView, '.side-div');
					
					break;
				case "new" :
					var roof = new Roof();
					
					if (!this.newView)
					{
						this.newView = new NewView();
					}
					this.newView.setModel(roof);
					this.assign(this.newView, '.side-div');
					
					this.mapView.prepareFor('new', roof);
					break;
				case "details" :
					if (!id) return;
					
					var roof = new Roof({ id : id }),
						self = this;
						
					roof.fetch({ success : function(){
					
						// decode json values in pictures attribute
						roof.set({
							pictures : JSON.parse(roof.get('pictures'))
						});
					
						self.assign(new GenericView({
							template : Templates.renderDetailsView(),
							data : roof.toJSON()
						}), '.side-div');
						//console.log(roof.toJSON());

						self.mapView.prepareFor('details', roof);
					}});
					
					break;
			}
		}

	});
});