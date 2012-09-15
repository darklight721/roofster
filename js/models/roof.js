
define(['Backbone'], function(Backbone){

	var roof = null;

	var checkAttr = {
		type : function(value) {
			if (value !== 'room' && value !== 'apartment' && value !== 'house')
				return 'Type can only be either a Room, Apartment or House.';
			return false;
		},
		address : function(value) {
			if (value === '' || value.length > 256)
				return 'Address is either empty or too long.';
			return false;
		},
		rate : function(value) {
			if (!value || isNaN(value) || value < 0)
				return 'Rate should be numeric.';
			return false;
		},
		latitude : function(value) {
			if (!value || isNaN(value))
				return 'Please make sure you did drop a pin on the map.';
			return false;
		},
		longitude : function(value) {
			if (!value || isNaN(value))
				return 'Please make sure you did drop a pin on the map.';
			return false;
		},
		contact_person : function(value) {
			if (value === '' || value.length > 128)
				return 'Contact Person is either empty or too long.';
			return false;
		},
		contact_number : function(value) {
			if (value === '' || value.length > 128)
				return 'Contact Number is either empty or too long.';
			return false;
		},
		email : function(value) {
			if (value.length === 0 && roof.get('passcode').length === 0 && !roof.get('id'))
				return false;
			if (!(value && value.length <= 128 && /^([\w!.%+\-])+@([\w\-])+(?:\.[\w\-]+)+$/.test(value)))
				return 'Email is invalid.';
			return false;
		},
		passcode : function(value) {
			if (value.length === 0 && roof.get('email').length === 0 && !roof.get('id'))
				return false;
			if (!(value && value.length >= 4 && value.length <= 16))
				return 'Passcode should be between 4 to 16 characters long.';
			return false;
		}
	}

	return Backbone.Model.extend({

		initialize : function() {
			roof = this;
		},

		urlRoot : "api/roofs",
		
		defaults : {
			  id 				: null
			, type 				: "room" // room, apartment/condo, house
			, address 			: ""
			, city 				: "Cebu City"
			, country			: "Philippines"
			, rate				: ""
			, latitude			: ""
			, longitude			: ""
			, contact_person	: ""
			, contact_number	: ""
			, details			: ""
		//	, pictures			: []
			, email				: ""
			, passcode			: ""
		},
		
		validateAttr : function(attrs){
			var error = {};

			_.each(attrs, function(value, key){
				if (checkAttr[key])
				{
					error[key] = checkAttr[key](value);
				}
			});
			
			return error;
		}
	});
});