define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	require('Bootstrap');

	return Backbone.View.extend({

		initialize : function() {
			this.render();
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.bind('change', this.modelChanged, this);
		},

		render : function() {
			this.$el.html(
				Templates.renderNewView()
			);
			
			// set tooltip for pictures
			this.$('#picture_names').tooltip({
				title : 'A maximum of 3 files can be selected, and each file should not be more than 512 kb in size.'
			});

			return this;
		},

		events : {
			  'change #pictures' : 'changePictures'
			, 'change' : 'change'
			, 'click .type' : 'setType'
			, 'click #save' : 'saveRoof'
			, 'click #picture_chooser' : 'openFile'
		},
		
		changePictures : function(evt) {
			console.log('change pictures');
			
			var result = this.validatePictures(evt.target.files);
			if (result)
			{
				// display the names
				var names = '';
				$.each(evt.target.files, function(){
					names += this.name + ' ';
				});
				this.$('#picture_names').val(names);
			}
			else
			{
				this.$(evt.target)[0].files = [];
			}
			
			return false; // so this event won't be captured in change event below anymore
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
				if (evt.target.dataset['dependency'])
					this.removeError(evt.target.dataset['dependency']);
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
				var self = this;
		        this.model.save(null, {
		            success: function (model) {
						console.log('save success');
						self.uploadPictures(
							function(data) {
								console.log(data);
								alert('Success');
							},
							function() {
								alert('Error');
							}
						);
		            },
		            error: function (error) {
						console.log(error);
		                alert('Error');
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
		
		openFile : function() {
			this.$('#pictures').click();
		},
		
		validatePictures : function(files) {
			if (files.length > 3)
				return false;
			
			for (var i = 0; i < files.length; i++)
			{
				var file = files[i];
				
				if (!file.type.match(/image.*/))
					return false;
				
				if (file.size > 512000)
					return false;
			}
			
			return true;
		},
		
		uploadPictures : function(success, error) {
			var formData = new FormData(),
				files = this.$('#pictures')[0].files;
				
			$.each(files, function() {
				formData.append('pictures[]', this);
			});
			
			if (files.length > 0)
			{
				$.ajax({
					url: 'api/upload/' + this.model.get('id'),
					type: 'POST',
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
					success: success,
					error: error
				});
			}
		}
	});
});