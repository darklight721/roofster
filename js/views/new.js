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
			, 'click #clear' : 'clearPictures'
			, 'click #picture_chooser' : 'openFile'
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

		openFile : function() {
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
			console.log(evt);
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
			
			var errorFree = true;
			var error = this.model.validateAttr(this.model.toJSON());
			_.each(error, function(value, key){
				if (value)
				{
					errorFree = false;
					showError(
						this.$('#' + key),
						value
					);
				}
			}, this);

			if (errorFree)
			{
				// set button state
				this.$('#save').button('loading');

				var self = this;
		        this.model.save(null, {
		            success: function (model, response) {
						if (response === 'error')
						{
							self.$('#save').button('reset');
							alert('Email and Passcode did not match.');
						}
						else
						{
							console.log('save success');
							var files = self.$('#pictures')[0].files;
							if (files.length > 0 || (self.model.has('pictures') && self.$('#picture_names').val() === ''))
							{
								console.log('uploading pictures');
								uploadPictures(
									  self.model.get('id')
									, files
									, function(data) {
										console.log(data);
										if (data !== 'error')
										{
											self.model.set({
												pictures : JSON.parse(data)
											}, { silent : true });
										}
										//alert('Success');
										window.location.href = '#roofs/' + self.model.get('id');
									  }
									, function() {
										// set button state
										self.$('#save').button('reset');
										alert('Uploading Pictures Error.');
									  }
								);
							}
							else
							{
								console.log('no pictures');
								window.location.href = '#roofs/' + self.model.get('id');
							}
						}
		            },
		            error: function (error) {
						console.log(error);
						// set button state
						self.$('#save').button('reset');
		                alert('Saving Roof Error.');
		            }
		        });
	    	}
		},
		
		deleteRoof : function() {
			console.log('deleting roof');
			if (this.model.get('id'))
			{
				var errorFree = true;
				var errors = this.model.validateAttr(_.pick(this.model.toJSON(), 'email', 'passcode'));
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
				
				if (errorFree)
				{
					this.$('#remove').button('loading');
					
					var self = this;
					var error = function() {
						self.$('#remove').button('reset');
						alert('Deleting Roof Error.');
					};
					
					this.model.destroy({
						  url : this.model.url() + '/' + this.model.get('email') + '/' + this.model.get('passcode')
						, success : function(model, response) {
							console.log(response);
							if (response === 0)
							{
								error();
							}
							else
							{
								window.location.href = '#';
							}
						  }
						, error : error
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