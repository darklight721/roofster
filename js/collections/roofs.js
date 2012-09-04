
define(['Backbone','Roof'], function(Backbone, Roof){
	return Backbone.Collection.extend({

		model : Roof,

		url : "api/roofs",

		indexOf : function(id) {
			var ids = this.pluck('id');
			return _.indexOf(ids, id);
		}
		
	});
});