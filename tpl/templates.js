
define(function(require){

	var   Handlebars = require('Handlebars')
		, _headerviewtpl = require('text!../tpl/headerview.tpl')
		, _homeviewtpl = require('text!../tpl/homeview.tpl')
		, _aboutviewtpl = require('text!../tpl/aboutview.tpl')
		, _contactviewtpl = require('text!../tpl/contactview.tpl')
		, _mapviewtpl = require('text!../tpl/mapview.tpl')
		, _listviewtpl = require('text!../tpl/listview.tpl')
		, _newviewtpl = require('text!../tpl/newview.tpl')
		, _detailsviewtpl = require('text!../tpl/detailsview.tpl');

	return {
		renderHeaderView : function() {
			return Handlebars.compile(_headerviewtpl);
		},
		renderHomeView : function() {
			return Handlebars.compile(_homeviewtpl);
		},
		renderAboutView : function() {
			return Handlebars.compile(_aboutviewtpl);
		},
		renderContactView : function() {
			return Handlebars.compile(_contactviewtpl);
		},
		renderMapView : function() {
			return Handlebars.compile(_mapviewtpl);
		},
		renderListView : function() {
			return Handlebars.compile(_listviewtpl);
		},
		renderNewView : function() {
			return Handlebars.compile(_newviewtpl);
		},
		renderDetailsView : function() {
			return Handlebars.compile(_detailsviewtpl);
		}
	};

});