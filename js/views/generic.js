
define(['Backbone'], function(Backbone) {

	return Backbone.View.extend({

		initialize : function(options) {
			this.template = options.template || null;
			this.data = options.data || {};

			this.render();
		},

		render : function() {
			this.$el.html(this.template(this.data));
			return this;
		}

	});

});