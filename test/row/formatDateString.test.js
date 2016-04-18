var fds = require("../../src/scripts/row/formatDateString"),
    chai = require("chai"),
    expect = require("chai").expect;

describe("formatDateString", function() {
    it("should not change a proper datetime string", function() {
        expect(fds("2015-01-01T00:00:00Z")).to.eql("2015-01-01T00:00:00Z");
    });
    it("should tolerate a missing 'T' from datetime string", function() {
        expect(fds("2015-01-01 00:00:00Z")).to.eql("2015-01-01T00:00:00Z");
        expect(fds("2015-01-01 00:00:00-0500")).to.eql("2015-01-01T05:00:00Z");
        expect(fds("2015-01-01 12:00")).to.eql("2015-01-01T00:00:00Z");
    });
    it("should default to GMT", function() {
        expect(fds("2015-01-01T00:00:00")).to.eql("2015-01-01T00:00:00Z");
    });
    it("should preserve timezone", function() {
        expect(fds("2015-01-01T00:00:00-04:00")).to.eql("2015-01-01T04:00:00Z");
    });
});
