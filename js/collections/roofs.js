
define(['Backbone','Roof'], function(Backbone, Roof){
	return Backbone.Collection.extend({

		model : Roof,

		url : "api/roofs"
		
	});
});