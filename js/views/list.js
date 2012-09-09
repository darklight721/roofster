
define(function(require){
	var   Backbone = require('Backbone')
		, ListItemView = require('ListItemView')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderListView();

			this.model.on('add', this.addItem, this);
			this.model.on('reset', this.renderItems, this);
		},

		render : function() {
			this.$el.html(
				this.template()
			);

			this.renderItems();

			return this;
		},

		renderItems : function() {
			var $listItems = this.$('.list-items');

			$listItems.empty();
			_.each(this.model.models, function(model){
				$listItems.prepend(new ListItemView({ model : model }).render().el);
			});
		},

		addItem : function(evt, models, options) {
			var model = this.model.at(options.index);
			if (model)
			{
				this.$('.list-items').prepend(new ListItemView({ model : model }).render().el);
			}
		}

	});
});