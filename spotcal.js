var http = require('http');
var bl = require('bl');
var xml2js = require('xml2js');

var url = 'http://thespotgym.com/events/free-member-workshops/';

http.get(url, function(response) {
    response.pipe(bl(function(err, data) {
        if(err) {
            return console.error(err);
        }
        return console.log(data.toString());
    }));
});
