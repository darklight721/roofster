
define(function(require){
	var   Backbone = require('Backbone')
		, Roof = require('Roof')
		, Templates = require('Templates')
		, MapView = require('MapView')
		, ListView = require('ListView')
		, NewView = require('NewView');

	return Backbone.View.extend({

		className: 'row',

		initialize : function() {
			console.log('home initialize');
			this.mapView = new MapView();
			this.render();
		},

		render : function() {
			this.$el.html(
				Templates.renderHomeView()
			);
			this.assign(this.mapView, '.map-div');
			return this;
		},

		setSideView : function(view) {
			switch (view)
			{
				case "list" :
					if (!this.listView)
					{
						this.listView = new ListView();
					}
					this.assign(this.listView, '.side-div');
					
					this.mapView.prepareFor('list');
					break;
				case "new" :
					var roof = new Roof();
					
					if (!this.newView)
					{
						this.newView = new NewView();
					}
					this.newView.setModel(roof);
					this.assign(this.newView, '.side-div');
					
					this.mapView.setModel(roof);
					this.mapView.prepareFor('new');
					break;
			}
		}

	});
});