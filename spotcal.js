var http = require('http');
var bl = require('bl');
var parseString = require('xml2js').parseString;
var map = require('./map');
var scrub = require('./scrub');

var url = 'http://thespotgym.com/events/free-member-workshops/';

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
        return scrub(html.substring(startIndex, endIndex));
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

var removeNewlines = function(str) {
    return str.replace(/\n/g, '');
};

var removeAnchorTags = function(str) {
    return str.replace(/<\/?a[^>]*>/g, '');
};

var parseWorkshopInfo = function(html) {
    var workshop = {};
    html = removeNewlines(html);
    html = removeAnchorTags(html);

    workshop.origHtml = html;

    var title = parseHtml(html, {startPattern: '<strong>'
                                 , endPattern:'</strong>'});
    html = html.replace(/<strong>.*<\/strong>/, '');

    var whoAndWhen = parseHtml(html, {startPattern:'<em>'
                                , endPattern:'</em>'});
    whoAndWhen = whoAndWhen.split('<br />');

    html = html.replace(/<em>.*<\/em>/, '');

    var description = parseHtml(html, {startPattern:'<br />'
                                       , endPattern:'<br />'});
    html = html.replace(/<br \/>.*<br \/>/, '');

    workshop.title = title;
    workshop.description = description;

    console.log(title);
    console.log(whoAndWhen);
    var when = parseWhoAndWhen(whoAndWhen);
    console.log(when);
    console.log();

    return workshop;
};

var parseWhoAndWhen = function(arr) {
    var times = parseWhens(arr);
    console.log(filter(times, containsPresenter));
    return times;
};

var parseWhens = function (arr) {
    var whens = [];
    var i = 0;
    while (i<arr.length) {
        if(containsTime(arr[i])) {
            whens.push({when:arr[i]});
        }
        i++;
    }
    return whens;
};

var containsTime = function(str) {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return containsOne(days, str);
};

var containsPresenter = function(str) {
    var keywords = ['Presented by', 'With'];
    return containsOne(keywords, str);
};

var containsOne = function(arr, str) {
    var i = 0;
    while (i < arr.length) {
        if(str.when) {
            console.log("str", str);
        }
        if(str.indexOf(arr[i]) > -1) {
            return true;
        }
        i++;
    }
    return false;
};

var filter = function(list, func) {
    var i = 0;
    var i_end = list.length;
    var new_list = [];
    while(i < i_end) {
        if(func(list[i])) {
            new_list.push(list[i]);
        }
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
//        console.log(workshops);
        return xml;
    }));
});
