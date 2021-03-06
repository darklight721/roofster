
define(['$', 'Bootstrap', 'exports'], function($, Bootstrap, exports) {
	
	exports.showError = function(elem, errorMsg) {
		if (!elem) return;
		elem.parent().addClass('error');
		elem.tooltip({
			title : errorMsg
		});
	};

	exports.removeError = function(elem) {
		if (!elem) return;
		elem.parent().removeClass('error');
		elem.tooltip('destroy');
	};

	exports.validatePictures = function(files) {
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
	};

	exports.uploadPictures = function(id, files, success, error) {
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
	};

	exports.extractPictureNames = function(pictures, id) {
		var names = '';
		$.each(pictures, function(){
			names += this.replace('pics/' + id + '/', '') + ' ';
		});
		return names;
	};

});