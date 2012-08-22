
define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	require('Bootstrap');

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

			var error = this.model.validateAttr(attr);
			if (error[evt.target.id])
			{
				this.showError(evt.target.id, error[evt.target.id]);
			}
			else
			{
				this.removeError(evt.target.id);
			}
		},
		
		modelChanged : function() {
			console.log('roof attr changed');
			if (this.model.hasChanged('address'))
			{
				this.$('#address').val(this.model.get('address'));
				this.removeError('address');
			}
			else if (this.model.hasChanged('latitude'))
			{
				this.removeError('latitude');
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
			
			var errorFree = true;
			var error = this.model.validateAttr(this.model.attributes);
			_.each(error, function(value, key){
				if (value)
				{
					errorFree = false;
					this.showError(key, value);
				}
			}, this);

			if (errorFree)
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

		showError : function(elemId, errorMsg) {
			var el = this.$('#' + elemId);
			el.parent().addClass('error');
			el.tooltip({
				title : errorMsg
			});
		},

		removeError : function(elemId) {
			var el = this.$('#' + elemId);
			el.parent().removeClass('error');
			el.tooltip('destroy');
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.bind('change', this.modelChanged, this);
		}
	});
});