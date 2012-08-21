
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {

			this.render();

		},

		render : function() {
			this.$el.html(
				Templates.renderListView()
			);

			return this;
		}

	});
});