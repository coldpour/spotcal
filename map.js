var map = function(list, func) {
    var i = 0;
    var i_end = list.length;
    var new_list = [];
    while(i < i_end) {
        var new_value = func(list[i]);
        new_list.push(new_value);
        i++;
    }
    return new_list;
};

module.exports = map;
