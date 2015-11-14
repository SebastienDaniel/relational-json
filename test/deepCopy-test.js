var deepCopy = require("../src/scripts/deepCopy"),
    chai = require("chai"),
    expect = require("chai").expect;

describe("deepCopy()", function() {
    var obj = {
            "name": "seb",
            first: 1,
            "last": 2,
            "deep": {
                deeper: "hello im deep",
                deeperNumber: 1234,
                deeperArray: ["seb", "dan", "iel"]
            }
        },
        arr = [
            {
                "level1": "sebastien",
                "level2": {
                    "name": "sebastien"
                }
            },
            {
                level1: "sebastien",
                level2: {
                    "name": ["seb", "dan"]
                }
            }
        ];

    it("should copy a nested object", function() {
        expect(JSON.stringify(deepCopy(obj))).to.be.eql(JSON.stringify(obj));
    });

    it("should copy nested arrays", function() {
        expect(JSON.stringify(deepCopy(arr))).to.be.eql(JSON.stringify(arr));
    });
});
