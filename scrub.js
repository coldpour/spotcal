var scrub = function(str) {
    str = str.replace(/&amp;/, '&');
    return str.replace(/^[ \n]/, '');
};

module.exports = scrub;
