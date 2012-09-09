roofster
========

i. Introduction
---------------

	Roofster provides a place for users to quickly put up their houses or rooms, or as I call it, roofs that are for rent online. Users then who are looking for a roof to settle in for a period of time will be able to find your roofs easily through the map oriented navigation. Fast and simple, no frills, very minimal, this service is totally made for the fast paced citizens of this ever changing world.
	
	Technically speaking, Roofster is a single-page web application that follows a RESTful approach. It is built on Backbone.js for its frontend and Slim PHP Framework for its backend.
	
	The name Roofster, why? I was looking for a collective term for houses, rooms and apartments, so I came up with the Roof. I added '-ster' to make it sound fancier, kinda like friendster or napster, thus Roofster.

1. Roofster Structure Overview
------------------------------

	api/
		Slim/
		.htaccess
		index.php
	css/
		bootstrap.min.css
		styles.css
	img/
	js/
		ext/
		models/
			roof.js
		collections/
			roofs.js
		views/
			header.js
			home.js
			map.js
			marker.js
			list.js
			form.js
			generic.js
			sideviews.js
		helpers/
			mapHelper.js
			formHelper.js
		main.js
		router.js
	tpl/
		headerview.tpl
		homeview.tpl
		aboutview.tpl
		contactview.tpl
		mapview.tpl
		listview.tpl
		formview.tpl
		templates.js
	pics/
	index.html
	README.md
	roofster.sql