
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
	
	var applySort = {};
	
	applySort['date'] = function(models) {
		return _.sortBy(models || roofs.models, function(model){
			return model.get('date_added');
		});
	};
	
	applySort['rate'] = function(models) {
		return _.sortBy(models || roofs.models, function(model){
			return parseInt(model.get('rate'), 10);
		});
	};

	return Backbone.Collection.extend({

		model : Roof,

		url : "api/roofs",

		initialize : function() {
			roofs = this;
			this.filters = {};
		},

		indexOf : function(id) {
			var ids = this.pluck('id');
			return _.indexOf(ids, id);
		},

		hasFilter : function() {
			return _.any(this.filters, function(allowedValues){
				return !_.isEmpty(allowedValues);
			});
		},

		setFilter : function(attr, allowedValues) {
			if (_.isEmpty(this.filters[attr]) && _.isEmpty(allowedValues))
				return;
			
			this.filters[attr] = allowedValues;
			this.trigger('filter');
		},

		resetFilter : function() {
			for (var key in this.filters)
			{
				this.filters[key] = null;
			}
			this.trigger('filter:reset');
		},

		getModels : function(sort) {
			var models = null;
			_.each(this.filters, function(allowedValues, attr){
				if (!_.isEmpty(allowedValues) && applyFilter[attr])
				{
					models = applyFilter[attr](allowedValues, models);
				}
			});
			
			if (sort)
			{
				if (sort !== 'date' && applySort[sort])
					models = applySort[sort](models);
			}

			return models || this.models;
		}
		
	});
});