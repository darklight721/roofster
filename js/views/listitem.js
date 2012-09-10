
define(['Backbone', 'Templates', 'DateHelper'], function(Backbone, Templates, DateHelper){

	return Backbone.View.extend({

		tagName : 'li',

		initialize : function() {
			this.template = Templates.renderListItemView();

			this.model.on('change', this.render, this);
			this.model.on('remove', this.remove, this);
		},

		render : function() {
			var data = this.model.toJSON();
			data.date_added = DateHelper.prettyDate(data.date_added, 'YYYY-MM-DD');

			this.$el.html(this.template(data));

			return this;
		},

		remove : function() {
			this.$el.remove();
		}

	});

});