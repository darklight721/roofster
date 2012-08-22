
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	return Backbone.View.extend({

		initialize : function() {
			this.render();
		},

		render : function() {
			this.$el.html(
				Templates.renderNewView()
			);

			return this;
		},

		events : {
			  'change' : 'change'
			, 'click .type' : 'setType'
			, 'click #save' : 'saveRoof'
		},

		change : function(evt) {
			console.log(evt);

			var attr = {};
			attr[evt.target.id] = $.trim(evt.target.value);
			this.model.set(attr, { silent : true });

			var result = this.model.validateAttr(attr);
			if (result)
			{
				this.$(evt.target.parentElement).removeClass('error');
			}
			else
			{
				this.$(evt.target.parentElement).addClass('error');
			}
		},
		
		modelChanged : function() {
			console.log('roof attr changed');
			if (this.model.hasChanged('address'))
			{
				this.$('#address').val(this.model.get('address'));
			}
		},

		setType : function(evt) {
			this.$('.type').removeClass('active');
			this.$(evt.target).addClass('active');
			this.model.set({
				type : this.$(evt.target).data('type')
			}, { silent : true });
		},

		saveRoof : function() {
			console.log('save roof');
			
			var result = this.model.validateAttr(this.model.attributes);
			if (result)
			{
		        this.model.save(null, {
		            success: function (model) {
		                alert('success');
		            },
		            error: function (error) {
		                alert(error);
		            }
		        });
	    	}
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.bind('change', this.modelChanged, this);
		}
	});
});