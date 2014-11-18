var http = require('http');
var bl = require('bl');
var parseString = require('xml2js').parseString;

var url = 'http://thespotgym.com/events/free-member-workshops/';

var removeFirstLine = function(str) {
    var indexOfSecondLine = str.indexOf('\n')+1;
    return str.substring(indexOfSecondLine, str.length);
};

var trim = function(str) {
    return str.replace(/^[ \n]/, '');
};

var parseHtml = function(html, options) {
    var startPattern = options.startPattern;
    if(!startPattern) return "";
    var endPattern = options.endPattern;
    if(!endPattern) return "";

    var startIndex = html.indexOf(startPattern);
    if(-1 === startIndex) return "";
    var endIndex = html.indexOf(endPattern, startIndex + 1);
    if(-1 === endIndex) endIndex = html.length;

    var removePattern = options.removePattern;
    if (removePattern) {
        startIndex += removePattern.length;
    } else {
        startIndex += startPattern.length;
    }

    return trim(html.substring(startIndex, endIndex));
};

var parseWorkshopInfo = function(html) {
    var workshop = {};
    var title = parseHtml(html, {startPattern: '<strong>'
                                 , endPattern:'</strong>'});

    var description = parseHtml(html, {startPattern:'<br />'
                                       , endPattern:'<br />'});

    var presenter = parseHtml(html, {startPattern:'<em>'
                                     , endPattern:'<br />'});

    var classSize = parseHtml(html, {startPattern:'<br />\nTarget'
                                     , endPattern:'<br />'
                                     , removePattern:'<br />\n'});

    workshop.title = title;
    workshop.description = description + " " + presenter + ".";
    if (classSize) {
        workshop.description += " " + classSize;
    }
//    workshop.html = html;
    return workshop;
};

var parseWorkshops = function(html) {
    var workshops = [];
    var cellStartPattern = '<td>';
    var titleStartPattern = '<strong>';
    var startPattern = cellStartPattern + titleStartPattern;
    var endPattern = '</td>';
    var startIndex = html.indexOf(startPattern, 0);

    while( startIndex > -1 ){
        startIndex += cellStartPattern.length;
        var endIndex = html.indexOf(endPattern, startIndex);
        var rawWorkshop = html.substring(startIndex, endIndex);
        var workshop = parseWorkshopInfo(rawWorkshop);
        workshops.push(workshop);
        startIndex = html.indexOf(startPattern, endIndex);
    }
    return workshops;
};

http.get(url, function(response) {
    response.pipe(bl(function(err, data) {
        if(err) {
            return console.error(err);
        }
        var xml = data.toString();
        xml = removeFirstLine(xml);
//        console.log(xml);
        var workshops = parseWorkshops(xml);
        console.log(workshops);
        return xml;
    }));
});
