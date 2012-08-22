
define(function(require){

	var   Backbone = require('Backbone')
		, HeaderView = require('HeaderView')
		, HomeView = require('HomeView')
		, GenericView = require('GenericView')
		, Templates = require('Templates');

	return Backbone.Router.extend({

		routes : {
			  ""				: "home"
			, "about"			: "about"
			, "contact"			: "contact"
			, "roofs/new"		: "newRoof"
		},

		initialize : function() {
			this.headerView = new HeaderView();
			$('#header').html(this.headerView.el);
		},

		home : function() {
			console.log("home");
			this.headerView.selectMenuItem('home-menu');

			if (!this.homeView)
			{
				this.homeView = new HomeView();
			}
			$('#container').html(this.homeView.el);
			this.isHomeView = true;

			this.homeView.setSideView("list");
		},

		about : function() {
			console.log("about");
			this.headerView.selectMenuItem('about-menu');

			if (!this.aboutView)
			{
				this.aboutView = new GenericView({
					template : Templates.renderAboutView
				});
			}
			$('#container').html(this.aboutView.el);
			this.isHomeView = false;
		},

		contact : function() {
			console.log("contact");
			this.headerView.selectMenuItem('contact-menu');

			if (!this.contactView)
			{
				this.contactView = new GenericView({
					template : Templates.renderContactView
				});
			}
			$('#container').html(this.contactView.el);
			this.isHomeView = false;
		},

		newRoof : function() {
			console.log("new roof");

			if (!this.isHomeView)
			{
				this.home();
			}

			this.homeView.setSideView("new");
		}
	});

});