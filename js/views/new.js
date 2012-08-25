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
		if (!id || !files) return;

		var formData = new FormData();
			
		$.each(files, function() {
			formData.append('pictures[]', this);
		});
		
		if (files.length > 0)
		{
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
	}

	return Backbone.View.extend({

		initialize : function() {
			this.template = Templates.renderNewView();
			this.render();
		},
		
		setModel : function(model) {
			this.model = model;
			this.model.bind('change', this.modelChanged, this);
		},

		render : function() {
			this.$el.html(
				this.template()
			);
			
			// set tooltip for pictures
			this.$('#picture_names').tooltip({
				title : 'A maximum of 3 files can be selected, and each file should not be more than 512 kb in size.'
			});

			return this;
		},

		events : {
			  'click .type' : 'setType'
			, 'click #picture_chooser' : 'openFile'
			, 'change #pictures' : 'changePictures'
			, 'change' : 'change'
			, 'click #save' : 'saveRoof'
		},

		setType : function(evt) {
			this.$('.type').removeClass('active');
			this.$(evt.target).addClass('active');
			this.model.set({
				type : this.$(evt.target).data('type')
			}, { silent : true });
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
				var self = this;
		        this.model.save(null, {
		            success: function (model) {
						console.log('save success');
						var files = self.$('#pictures')[0].files;
						if (!files)
						{
							window.location.href = "#roofs/" + self.model.get('id');
						}
						else
						{
							uploadPictures(
								  self.model.get('id')
								, files
								, function(data) {
									console.log(data);
									if (data)
									{
										self.model.set({
											pictures : data
										}, { silent : true });
									}
									//alert('Success');
									window.location.href = "#roofs/" + self.model.get('id');
								  }
								, function() {
									alert('Error');
								  }
							);
						}
		            },
		            error: function (error) {
						console.log(error);
		                alert('Error');
		            }
		        });
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