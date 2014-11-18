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
    var removePattern = options.removePattern;
    var startOccurance = options.startOccurance;

    var startIndex = html.indexOf(startPattern, 0);
    var _handleRemovePattern = function() {
        if (removePattern) {
            startIndex += removePattern.length;
        } else {
            startIndex += startPattern.length;
        }
        return startIndex;
    };

    var endIndex;
    var _findEndIndex = function() {
        var endIndex = html.indexOf(endPattern, startIndex + 1);
        if(-1 === endIndex) endIndex = html.length;
        return endIndex;
    };

    var _cleanSubstring = function() {
        return trim(html.substring(startIndex, endIndex));
    };

    if(options.multiple) {
        var arr = [];
        var occurance = 0;

        while(startIndex > -1){
            occurance++;
            startIndex = _handleRemovePattern();
            endIndex = _findEndIndex();
            if(!startOccurance || occurance >= startOccurance) {
                arr.push(_cleanSubstring());
            }
            startIndex = html.indexOf(startPattern, endIndex);
        }
        return arr;
    } else {
        if(-1 === startIndex) return "";
        startIndex = _handleRemovePattern();
        endIndex = _findEndIndex();

        return _cleanSubstring();
    }
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

    var when = parseHtml(html, {startPattern:'<br />'
                                , endPattern:'<br />'
                                , multiple:true
                                , startOccurance:3});

    workshop.title = title;
    workshop.description = description + " " + presenter + ".";
    if (classSize) {
        workshop.description += " " + classSize;
    }
    workshop.when = when;
//    workshop.html = html;
    return workshop;
};

var map = function(list, callback) {
    var i = 0;
    var i_end = list.length;
    var new_list = [];
    while(i < i_end) {
        new_list.push(callback(list[i]));
        i++;
    }
    return new_list;
};

http.get(url, function(response) {
    response.pipe(bl(function(err, data) {
        if(err) {
            return console.error(err);
        }
        var xml = data.toString();
        var rawWorkshops = parseHtml(xml, {startPattern:'<td><strong>'
                                        , endPattern:'</td>'
                                        , removePattern:'<td>'
                                        , multiple:true});
        var workshops = map(rawWorkshops, parseWorkshopInfo);
        console.log(workshops);
        return xml;
    }));
});
