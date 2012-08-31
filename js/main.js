
// dependencies
require.config({
	paths : {
		// libs
		  $				: 'ext/jquery-1.8.0.min'
		, _				: 'ext/underscore-min'
		, Backbone		: 'ext/backbone-min'
		, Handlebars	: 'ext/handlebars-1.0.0.beta.6'
		, text			: 'ext/text'
		, Bootstrap		: 'ext/bootstrap.min'
		// models
		, Roof			: 'models/roof'
		, Roofs			: 'collections/roofs'
		// views
		, HeaderView	: 'views/header'
		, HomeView		: 'views/home'
		, GenericView	: 'views/generic'
		, MapView		: 'views/map'
		, ListView		: 'views/list'
		, NewView		: 'views/new'
		, SideViews		: 'views/sideviews'
		, Templates		: '../tpl/templates'
		// router
		, Router		: 'router'
		// helpers
		, NewHelper		: 'helpers/newHelper'
		, MapHelper		: 'helpers/mapHelper'
	},
	shim : {
		'$': {
            exports: '$'
        },
        'Bootstrap' : [
        	'$'
        ],
		'Backbone' : {
			deps : ['_', '$'],
			exports : 'Backbone'
		},
		'Handlebars': {
            exports: 'Handlebars'
        }
	}
});

require(['$', 'Backbone', 'Router'], function($, Backbone, Router){

	Backbone.View.prototype.assign = function(view, selector) {
		view.setElement(this.$(selector)).render();
	};
	
	Backbone.View.prototype.empty = function(view) {
		if (view)
		{
			view.$el.empty();
		}
	};

	$(function(){
		new Router();
		Backbone.history.start();
	});
});