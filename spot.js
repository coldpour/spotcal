var http = require('http');
var bl = require('bl');

http.get('http://thespotgym.com/events/free-member-workshops/', function(response) {
	response.pipe(bl(function(err, data) {
		if(err) {
			return console.error('ERROR',err);
		}
		return console.log(data.toString());
	}));
});
