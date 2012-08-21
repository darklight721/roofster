
define(['Backbone','Templates'], function(Backbone, Templates){
	return Backbone.View.extend({

		initialize : function() {
			this.render();
		},

		render : function() {
			this.$el.html(
				Templates.renderHeaderView()
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