jest.dontMock('../map');
var map = require('../map');

describe('map', function() {
    it('applies add1() to each element of [1,2,3], returning [2,3,4]', function() {
        var add1 = function(n) { return n+1; };
        var result = map([1,2,3], add1);
        expect(result).toEqual([2,3,4]);
        expect(result).not.toEqual([1,2,3]);
    });
    it('returns an empty list when given an empty list as input', function() {
        var add1 = function(n) { return n+1; };
        expect(map([], add1)).toEqual([]);
    });
    it('applies add1() to each element of [\'hi\'], returning [\'hi1\']', function() {
        var add1 = function(n) { return n+1; };
        expect(map(['hi'], add1)).toEqual(['hi1']);
    });
});
