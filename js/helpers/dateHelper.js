
define(['exports'], function(exports){
	var months = [
		'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
	];

	exports.prettyDate = function(date, format) {
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
				return months[dateFrom.getMonth()] + ' ' + dateFrom.getDate() + ', ' + dateFrom.getFullYear();
			
			return (
				diff_day === 0 ? 'Today' :
				diff_day === 1 ? 'Yesterday' :
				diff_day < 7 ? diff_day + ' days ago' :
				diff_day < 14 ? '1 week ago' :
				Math.floor(diff_day / 7) + ' weeks ago'				
			);
		}
		
		return '';
	};
});