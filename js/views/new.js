define(function(require){
	var   Backbone = require('Backbone')
		, Templates = require('Templates');

	require('Bootstrap');

	function showError(elem, errorMsg) {
		if (!elem) return;
		elem.parent().addClass('error');
		elem.tooltip({
			title : errorMsg
		});
	}

	function removeError(elem) {
		if (!elem) return;
		elem.parent().removeClass('error');
		elem.tooltip('destroy');
	}

	function validatePictures(files) {
		if (!files || files.length > 3)
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
	}

	function uploadPictures(id, files, success, error) {
		if (!id) return;

		var formData = new FormData();
			
		$.each(files, function() {
			formData.append('pictures[]', this);
		});
		
		$.ajax({
			url: 'api/upload/' + id,
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: success,
			error: error
		});
	}

	function extractPictureNames(pictures, id) {
		var names = '';
		$.each(pictures, function(){
			names += this.replace('pics/' + id + '/', '') + ' ';
		});
		return names;
	}

	function checkForErrors(attrs) {
		var errorFree = true;
		var errors = this.model.validateAttr(attrs);
		_.each(errors, function(value, key){
			if (value)
			{
				errorFree = false;
				showError(
					this.$('#' + key),
					value
				);
			}
		}, this);
		return errorFree;
	}

	function saveRoof_success(response) {
		if (response === 'error')
		{
			saveRoof_error.call(this);
		}
		else
		{
			console.log('save success');
			var files = this.$('#pictures')[0].files;
			if (files.length > 0 || (this.model.has('pictures') && this.$('#picture_names').val() === ''))
			{
				console.log('uploading pictures');
				var self = this;
				uploadPictures(
					  this.model.get('id')
					, files
					, function(response) {
						uploadPictures_success.call(self, response);
					  }
					, function() {
						uploadPictures_error.call(self);
					  }
				);
			}
			else
			{
				console.log('no pictures');
				window.location.href = '#roofs/' + this.model.get('id');
			}
		}
	}

	function saveRoof_error() {
		var elem = this.$('#save');
		// set button state
		elem.button('reset');
        elem.popover({
        	  trigger : 'manual'
        	, title : 'Error Saving Roof <button class="close" type="button" onclick=\'$("#save").popover("destroy");\'>&times;</button>'
        	, content : 'Please make sure your email and passcode match the ones you\'ve entered when you created this roof.'
        });
        elem.popover('show');
	}

	function uploadPictures_success(response) {
		console.log(response);
		if (response !== 'error')
		{
			this.model.set({
				pictures : JSON.parse(response)
			}, { silent : true });
		}
		//alert('Success');
		window.location.href = '#roofs/' + this.model.get('id');
	}

	function uploadPictures_error() {
		var elem = this.$('#save');
		// set button state
		elem.button('reset');
        elem.popover({
        	  trigger : 'manual'
        	, title : 'Error Uploading Pictures <button class="close" type="button" onclick=\'$("#save").popover("destroy");\'>&times;</button>'
        	, content : 'There was a server error while uploading your pictures. Please try again.'
        });
        elem.popover('show');
	}

	function deleteRoof_success(response) {
		console.log(response);
		if (response === 0)
		{
			deleteRoof_error.call(this);
		}
		else
		{
			window.location.href = '#';
		}
	}

	function deleteRoof_error() {
		var elem = this.$('#remove');
		// set button state
		elem.button('reset');
        elem.popover({
        	  trigger : 'manual'
        	, title : 'Error Removing Roof <button class="close" type="button" onclick=\'$("#remove").popover("destroy");\'>&times;</button>'
        	, content : 'Please make sure your email and passcode match the ones you\'ve entered when you created this roof.'
        });
        elem.popover('show');
	}

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderNewView();
			//this.render();
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.bind('change', this.modelChanged, this);
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
					, pictureNames : data.pictures ? extractPictureNames(data.pictures, data.id) : ''
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
			
			var result = validatePictures(evt.target.files);
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
				showError(
					this.$('#' + evt.target.id),
					error[evt.target.id]
				);
			}
			else
			{
				removeError(this.$('#' + evt.target.id));
				if (evt.target.dataset['dependency'])
					removeError(this.$('#' + evt.target.dataset['dependency']));
			}
		},
		
		saveRoof : function() {
			console.log('save roof');

			var errorFree = checkForErrors.call(this, this.model.toJSON());
			if (errorFree)
			{
				// set button state
				this.$('#save').button('loading');
				this.$('#save').popover('destroy');
				this.$('#remove').popover('destroy');

				var self = this;
		        this.model.save(null, {
		            success: function (model, response) {
						saveRoof_success.call(self, response);
		            },
		            error: function (error) {
						saveRoof_error.call(self);
		            }
		        });
	    	}
		},
		
		deleteRoof : function() {
			console.log('deleting roof');
			if (this.model.get('id'))
			{	
				var errorFree = checkForErrors.call(this, {
					email : this.model.get('email'),
					passcode : this.model.get('passcode')
				});

				if (errorFree)
				{
					this.$('#remove').button('loading');
					this.$('#save').popover('destroy');
					this.$('#remove').popover('destroy');
					
					var self = this;
					this.model.destroy({
						  url : this.model.url() + '/' + this.model.get('email') + '/' + this.model.get('passcode')
						, success : function(model, response) {
							deleteRoof_success.call(this, response);
						  }
						, error : function() {
							deleteRoof_error.call(this);
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
				removeError(elem);
			}
			else if (this.model.hasChanged('latitude'))
			{
				removeError(this.$('#latitude'));
			}
		}

	});
});