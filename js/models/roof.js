
define(['Backbone'], function(Backbone){
	return Backbone.Model.extend({

		urlRoot : "api/roofs",

		checkAttr : {
			type : function(value) {
				if (value === 'room' || value === 'apartment' || value === 'house')
					return true;
				return false;
			},
			address : function(value) {
				if (value === '' || value.length > 256)
					return false;
				return true;
			},
			rate : function(value) {
				if (isNaN(value) || value < 0)
					return false;
				return true;
			},
			latitude : function(value) {
				if (isNaN(value))
					return false;
				return true;
			},
			longitude : function(value) {
				if (isNaN(value))
					return false;
				return true;
			},
			contact_person : function(value) {
				if (value === '' || value.length > 128)
					return false;
				return true;
			},
			contact_number : function(value) {
				if (value === '' || value.length > 128)
					return false;
				return true;
			},
			details : function(value) {
				return true;
			},
			email : function(value) {
				if (value && value.length <= 128 && /^([\w!.%+\-])+@([\w\-])+(?:\.[\w\-]+)+$/.test(value))
					return true;
				return false;
			},
			passcode : function(value) {
				if (value && value.length >= 4 && value.length <= 16)
					return true;
				return false;
			}
		},

		validateAttr : function(attrs){
			var result = false, self = this;

			$.each(attrs, function(key, value) {
				if (self.checkAttr[key])
				{
					result = self.checkAttr[key](value);
					return result;
				}
			});
			
			return result;
		},
		
		defaults : {
			  id 				: null
			, type 				: "room" // room, apartment/condo, house
			, address 			: ""
			, city 				: "Cebu City"
			, country			: "Philippines"
			, rate				: 0
			, latitude			: 0.0
			, longitude			: 0.0
			, contact_person	: ""
			, contact_number	: ""
			, details			: ""
			, pictures			: []
			, email				: ""
			, passcode			: ""
		}
	});
});