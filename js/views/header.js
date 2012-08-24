
define(['Backbone','Templates'], function(Backbone, Templates){
	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderHeaderView();
			this.render();
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			return this;
		},

		selectMenuItem : function(menuItem) {
			this.$('li').removeClass('active');
			if (menuItem)
			{
				this.$('.' + menuItem).addClass('active');
			}
		}

	});
});