
define(['Backbone', 'Templates', 'moment'], function(Backbone, Templates, moment){

	var month = [
		'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
	];

	function prettyDate(date, format)
	{
		if (!date || !format)
			return 'Today';
		
		var dateArr = date.split(''),
			formatArr = format.split(''),
			parsedDate = {};
			
		$.each(formatArr, function(index, key){
			if (index >= dateArr.length)
				return false;
			
			if (parsedDate.hasOwnProperty(key))
				parsedDate[key] += dateArr[index];
			else
				parsedDate[key] = dateArr[index];
		});
		
		var dateNow = new Date(),
			dateFrom = new Date(
				  parsedDate['Y'] || 0
				, parsedDate['M'] ? parsedDate['M'] - 1 : 0
				, parsedDate['D'] || 0
				, parsedDate['h'] || 0
				, parsedDate['m'] || 0
				, parsedDate['s'] || 0
			);
		
		if (dateNow && dateFrom)
		{
			var diff_day = Math.floor((dateNow.getTime() - dateFrom.getTime()) / 86400000);
			
			if (diff_day >= 28)
				return month[dateFrom.getMonth()] + ' ' + dateFrom.getDate() + ', ' + dateFrom.getFullYear();
			
			return (
				diff_day === 0 ? 'Today' :
				diff_day === 1 ? 'Yesterday' :
				diff_day < 7 ? diff_day + ' days ago' :
				diff_day < 14 ? '1 week ago' :
				Math.floor(diff_day / 7) + ' weeks ago'				
			);
		}
		
		return '';
	}

	return Backbone.View.extend({

		tagName : 'li',

		initialize : function() {
			this.template = Templates.renderListItemView();

			this.model.on('change', this.render, this);
			this.model.on('remove', this.remove, this);
		},

		render : function() {
			var data = this.model.toJSON();
			//data.date_added = moment(data.date_added, 'YYYY-MM-DD hh:mm:ss').fromNow();
			data.date_added = prettyDate(data.date_added, 'YYYY-MM-DD');

			this.$el.html(this.template(data));

			return this;
		},

		remove : function() {
			this.$el.remove();
		}

	});

});