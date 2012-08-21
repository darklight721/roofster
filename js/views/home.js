
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

			this.mapView = new MapView();
			this.listView = new ListView();
			this.newView = new NewView({
				model : new Roof()
			});

			this.render();

		},

		render : function() {

			this.$el.html(
				Templates.renderHomeView()
			);

			
			this.assign(this.mapView, '.map-div');
			//this.assign(this.listView, '.side-div');

			return this;
		},

		setView : function(view) {
			switch (view)
			{
				case "list" : this.assign(this.listView, '.side-div'); break;
				case "new" : this.assign(this.newView, '.side-div'); break;
			}
		}

	});
});