describe('arrays', function() {
    it('[2,3,4] should be exactly equal to itself', function() {
        var a = [2,3,4];
        expect(a).toBe(a);
    });
    it('[2,3,4] should be not be deeply equal to itself', function() {
        expect([2,3,4]).not.toBe([2,3,4]);
    });
    it('[2,3,4] should be deeply equal to itself', function() {
        expect([2,3,4]).toEqual([2,3,4]);
    });
    it('[2,3,4] should not be deeply equal to [2,3,4,5]', function() {
        expect([2,3,4]).not.toEqual([2,3,4,5]);
    });
    it('[2,3,4] should not be deeply equal to [3,4,5]', function() {
        expect([2,3,4]).not.toEqual([3,4,5]);
    });
});
