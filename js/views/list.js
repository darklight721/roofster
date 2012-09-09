
define(function(require){
	var   Backbone = require('Backbone')
		, ListItemView = require('ListItemView')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderListView();

			this.listView = new (Backbone.View.extend({
				tagName : 'ul',
				className : 'nav nav-tabs nav-stacked'
			}))();

			this.model.on('add', this.addItem, this);
			this.model.on('reset', this.renderItems, this);

			if (this.model.length)
				this.renderItems();
		},

		render : function() {
			this.$el.html(
				this.template()
			);

			this.$('.list-items').html(this.listView.el);

			return this;
		},

		renderItems : function() {
			this.listView.$el.empty();
			_.each(this.model.models, function(model){
				this.listView.$el.prepend(new ListItemView({ model : model }).render().el);
			}, this);
		},

		addItem : function(evt, models, options) {
			var model = this.model.at(options.index);
			if (model)
			{
				this.listView.$el.prepend(new ListItemView({ model : model }).render().el);
			}
		}

	});
});