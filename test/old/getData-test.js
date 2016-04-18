var getData = require("../src/scripts/getData"),
    chai = require("chai"),
    expect = require("chai").expect;

describe("getData", function() {
    var a = [
        {
            id: 1,
            name: "seb"
        },
        {
            id: 2,
            name: "bob"
        },
        {
            id: 3,
            name: "mitch"
        }
    ];

    it("should return proper object from an array", function() {
        expect(getData(a, 2)).to.equal(a[1]);
        expect(getData(a)).to.equal(a);
    });
});
