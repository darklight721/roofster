
define(function(require){

	var   Handlebars = require('Handlebars')
		, _headerviewtpl = require('text!../tpl/headerview.tpl')
		, _homeviewtpl = require('text!../tpl/homeview.tpl')
		, _aboutviewtpl = require('text!../tpl/aboutview.tpl')
		, _contactviewtpl = require('text!../tpl/contactview.tpl')
		, _mapviewtpl = require('text!../tpl/mapview.tpl')
		, _markerinfoviewtpl = require('text!../tpl/markerinfoview.tpl')
		, _listviewtpl = require('text!../tpl/listview.tpl')
		, _listitemviewtpl = require('text!../tpl/listitemview.tpl')
		, _formviewtpl = require('text!../tpl/formview.tpl')
		, _detailsviewtpl = require('text!../tpl/detailsview.tpl')
		, _sortctrlviewtpl = require('text!../tpl/sortctrlview.tpl');

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
		renderMarkerInfoView : function() {
			return Handlebars.compile(_markerinfoviewtpl);
		},
		renderListView : function() {
			return Handlebars.compile(_listviewtpl);
		},
		renderListItemView : function() {
			return Handlebars.compile(_listitemviewtpl);
		},
		renderFormView : function() {
			return Handlebars.compile(_formviewtpl);
		},
		renderDetailsView : function() {
			return Handlebars.compile(_detailsviewtpl);
		},
		renderSortCtrlView : function() {
			return Handlebars.compile(_sortctrlviewtpl);
		}
	};

});