
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderListView();
			this.render();
		},

		render : function() {
			this.$el.html(
				this.template()
			);

			return this;
		}

	});
});