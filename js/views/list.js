
define(function(require){
	var   Backbone = require('Backbone')
		, ListItemView = require('ListItemView')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderListView();
			this.sortCtrlTemplate = Templates.renderSortCtrlView();

			this.listView = new (Backbone.View.extend({
				tagName : 'ul',
				className : 'nav nav-tabs nav-stacked'
			}))();

			this.model.on('add', this.addItem, this);
			this.model.on('reset filter', this.renderItems, this);
			
			this.resetSort();

			if (this.model.length)
				this.renderItems();
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			
			this.renderSortCtrl();
			this.$('.list-items').html(this.listView.el);

			return this;
		},
		
		renderSortCtrl : function() {
			var data = {};
			data[this.sort.attr] = { isAscending : this.sort.isAscending };
			
			this.$('.sort-ctrl').html(
				this.sortCtrlTemplate(data)
			);
		},

		renderItems : function() {
			var iterator;
			
			if (this.sort.isAscending)
			{
				iterator = function(model) {
					this.listView.$el.prepend(new ListItemView({ model : model }).render().el);
				};
			}
			else
			{
				iterator = function(model) {
					this.listView.$el.append(new ListItemView({ model : model }).render().el);
				};
			}
			
			this.listView.$el.empty();
			_.each(this.model.getModels(this.sort.attr), iterator, this);
		},

		addItem : function(evt, models, options) {
			var model = this.model.at(options.index);
			if (model)
			{
				this.listView.$el.prepend(new ListItemView({ model : model }).render().el);
			}
		},
		
		resetSort : function() {
			this.sort = { attr : 'date', isAscending : false };
		},
		
		events : {
			'click button.sort' : 'applySort',
			'click button.new' : 'newRoof'
		},
		
		applySort : function(evt) {
			var data = $(evt.target).data('sort');
			
			if (data === this.sort.attr)
			{
				this.sort.isAscending = !this.sort.isAscending;
			}
			else
			{
				this.sort.attr = data;
				this.sort.isAscending = false;
			}
			
			this.renderSortCtrl();
			this.renderItems();
		},
		
		newRoof : function() {
			window.location.href = "#roofs/new";
		}

	});
});