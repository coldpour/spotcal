jest.dontMock('../scrub');
var scrub = require('../scrub');

describe('scrub', function() {
    it('removes one space from the begining of "  foo bar", returning " foo bar"', function () {
        expect(scrub("  foo bar")).toBe(" foo bar");
    });
    it('removes one newline from the begining of "\n\nfoo\n", returning "\nfoo\n"', function () {
        expect(scrub("\n\nfoo\n")).toBe("\nfoo\n");
    });
    it('decodes ampersands in "bow &amp; tie", returning "bow & tie"', function () {
        expect(scrub("bow &amp; tie")).toBe("bow & tie");
    });
});
