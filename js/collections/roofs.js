
define(['Backbone','Roof'], function(Backbone, Roof){

	var roofs = null;

	var rateRange = {
		  low : { min : 0, max : 2999 }
		, mid : { min : 3000, max : 7999 }
		, high : { min : 8000, max : 9999999 }
	};

	var applyFilter = {};

	applyFilter['type'] = function(types, models) {
		return _.filter(models || roofs.models, function(model){
			return _.any(types, function(type){
				return (type === model.get('type'));
			});
		});
	};

	applyFilter['rate'] = function(rates, models) {
		return _.filter(models || roofs.models, function(model){
			return _.any(rates, function(rate){
				var range = rateRange[rate];
				if (range)
				{
					return (range.min <= model.get('rate') &&
							range.max >= model.get('rate'));
				}
				return false;
			});
		});
	};

	return Backbone.Collection.extend({

		model : Roof,

		url : "api/roofs",

		initialize : function() {
			this.filters = {};

			roofs = this;
		},

		indexOf : function(id) {
			var ids = this.pluck('id');
			return _.indexOf(ids, id);
		},

		setFilter : function(attr, allowedValues) {
			this.filters[attr] = allowedValues;
			this.trigger('filter');
		},
		
		sortByDate : function(models) {
			return _.sortBy(this.getModels(), function(model){
				return model.get('date_added');
			});
		},
		
		sortByRate : function(models) {
			return _.sortBy(this.getModels(), function(model){
				return parseInt(model.get('rate'), 10);
			});
		},

		getModels : function() {
			var models = null;
			_.each(this.filters, function(allowedValues, attr){
				if (allowedValues && allowedValues.length > 0 && applyFilter[attr])
				{
					models = applyFilter[attr](allowedValues, models);
				}
			}, this);

			return models || this.models;
		}
		
	});
});