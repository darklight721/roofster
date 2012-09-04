define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates')
		, FormHelper = require('FormHelper');

	require('Bootstrap');
	
	// private members
	var formView = null; // this is just a reference to backbone view object, this is set when the backbone view is initialized.

	function checkForErrors(attrs) {
		var errorFree = true;
		var errors = formView.model.validateAttr(attrs);
		_.each(errors, function(value, key){
			if (value)
			{
				errorFree = false;
				FormHelper.showError(
					formView.$('#' + key),
					value
				);
			}
		});
		return errorFree;
	}

	function saveRoof_success(response) {
		if (response === 'error')
		{
			saveRoof_error();
		}
		else
		{
			console.log('save success');
			formView.model.trigger('saved');

			var files = formView.$('#pictures')[0].files;
			if (files.length > 0 || (formView.model.has('pictures') && formView.$('#picture_names').val() === ''))
			{
				console.log('uploading pictures');
				FormHelper.uploadPictures(
					  formView.model.get('id')
					, files
					, function(response) {
						uploadPictures_success(response);
					  }
					, function() {
						uploadPictures_error();
					  }
				);
			}
			else
			{
				console.log('no pictures');
				window.location.href = '#roofs/' + formView.model.get('id');
			}
		}
	}

	function saveRoof_error() {
        FormHelper.showPopOverError(
        	  formView.$('#save')
        	, 'Error Saving Roof <button class="close" type="button" onclick=\'$("#save").popover("destroy");\'>&times;</button>'
        	, 'Please make sure your email and passcode match the ones you\'ve entered when you created this roof.'
        );
	}

	function uploadPictures_success(response) {
		console.log(response);
		if (response !== 'error' && formView.roof)
		{
			formView.model.set({
				pictures : JSON.parse(response)
			}, { silent : true });
		}
		//alert('Success');
		window.location.href = '#roofs/' + formView.model.get('id');
	}

	function uploadPictures_error() {
		FormHelper.showPopOverError(
        	  formView.$('#save')
        	, 'Error Uploading Pictures <button class="close" type="button" onclick=\'$("#save").popover("destroy");\'>&times;</button>'
        	, 'There was a server error while uploading your pictures. Please try again.'
        );
	}

	function deleteRoof_success(response) {
		console.log(response);
		if (response === 0)
		{
			deleteRoof_error();
		}
		else
		{
			formView.model.trigger('removed');
			window.location.href = '#';
		}
	}

	function deleteRoof_error() {
		FormHelper.showPopOverError(
        	  formView.$('#remove')
        	, 'Error Removing Roof <button class="close" type="button" onclick=\'$("#remove").popover("destroy");\'>&times;</button>'
        	, 'Please make sure your email and passcode match the ones you\'ve entered when you created this roof.'
        );
	}

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderFormView();
			formView = this;
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.on('change', this.modelChanged, this);
		},

		render : function() {
			var data = {};
			if (this.model)
			{
				data = this.model.toJSON();
				data = _.extend(data, {
					  isRoom : data.type === 'room'
					, isApartment : data.type === 'apartment'
					, isHouse : data.type === 'house'
					, pictureNames : data.pictures ? FormHelper.extractPictureNames(data.pictures, data.id) : ''
				});
			}

			this.$el.html(
				this.template(data)
			);
			
			// set tooltip for pictures
			this.$('#picture_names').tooltip({
				title : 'A maximum of 3 files can be selected, and each file should not be more than 512 kb in size.'
			});

			return this;
		},

		events : {
			  'click .type' : 'setType'
			, 'click #picture_clear' : 'clearPictures'
			, 'click #picture_choose' : 'openPictures'
			, 'change #pictures' : 'changePictures'
			, 'change' : 'change'
			, 'click #save' : 'saveRoof'
			, 'click #remove' : 'deleteRoof'
		},

		setType : function(evt) {
			this.$('.type').removeClass('active');
			this.$(evt.target).addClass('active');
			this.model.set({
				type : this.$(evt.target).data('type')
			}, { silent : true });
		},

		clearPictures : function() {
			this.$('#pictures')[0].files = [];
			this.$('#picture_names').val('');
		},

		openPictures : function() {
			this.$('#pictures').click();
		},
		
		changePictures : function(evt) {
			console.log('change pictures');
			
			var result = FormHelper.validatePictures(evt.target.files);
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
				this.clearPictures();
			}
			
			return false; // so this event won't be captured in change event below anymore
		},

		change : function(evt) {
			console.log('change');
			var attr = {};
			attr[evt.target.id] = $.trim(evt.target.value);
			this.model.set(attr, { silent : true });

			var error = this.model.validateAttr(attr);
			if (error[evt.target.id])
			{
				FormHelper.showError(
					this.$('#' + evt.target.id),
					error[evt.target.id]
				);
			}
			else
			{
				FormHelper.removeError(this.$('#' + evt.target.id));
				if (evt.target.dataset['dependency'])
					FormHelper.removeError(this.$('#' + evt.target.dataset['dependency']));
			}
		},
		
		saveRoof : function() {
			console.log('save roof');

			var errorFree = checkForErrors(this.model.toJSON());
			if (errorFree)
			{
				// set button state
				this.$('#save').button('loading');
				this.$('#save').popover('destroy');
				this.$('#remove').popover('destroy');

		        this.model.save(null, {
		            success: function (model, response) {
						saveRoof_success(response);
		            },
		            error: function (error) {
						saveRoof_error();
		            }
		        });
	    	}
		},
		
		deleteRoof : function() {
			console.log('deleting roof');
			if (this.model.get('id'))
			{	
				var errorFree = checkForErrors({
					email : this.model.get('email'),
					passcode : this.model.get('passcode')
				});

				if (errorFree)
				{
					this.$('#remove').button('loading');
					this.$('#save').popover('destroy');
					this.$('#remove').popover('destroy');
					
					this.model.destroy({
						  url : this.model.url() + '/' + this.model.get('email') + '/' + this.model.get('passcode')
						, success : function(model, response) {
							deleteRoof_success(response);
						  }
						, error : function() {
							deleteRoof_error();
						}
					});
				}
			}
		},
		
		modelChanged : function() {
			console.log('roof attr changed');
			if (this.model.hasChanged('address'))
			{
				var elem = this.$('#address');
				elem.val(this.model.get('address'));
				FormHelper.removeError(elem);
			}
			else if (this.model.hasChanged('latitude'))
			{
				FormHelper.removeError(this.$('#latitude'));
			}
		}

	});
});