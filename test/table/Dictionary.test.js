var expect = require("chai").expect,
    Dict = require("../../src/scripts/table/Dictionary");

describe("Dictionary", function() {
    var hash = new Dict();

    describe("add()", function() {
        it("should accept key:value pairs", function() {
            var val = hash.add(1, {name: "val1"}).get("1"),
                val2 = hash.add(2, {name: "val2"}).get(2);

            expect(val).to.eql({name: "val1"});
        });
    });

    describe("all()", function() {
        it("should return an array of all data", function() {
            expect(hash.all()).to.be.instanceof(Array);
            expect(hash.all()).to.have.length(2);
        });
    });

    describe("get()", function() {
        it("should return the value associated to the provided key", function() {
            // string key
            expect(hash.get("1")).to.eql({name: "val1"});

            // number key
            expect(hash.get(2)).to.eql({name: "val2"});
        });

        it("should throw when adding to an existing key", function() {
            expect(function() {
                hash.add(1, {name: "val3"});
            }).to.throw(Error);
        });
    });

    describe("remove()", function() {
        it("should remove an existing item and return it", function() {
            var r = hash.remove(1);

            expect(r).to.eql({name: "val1"});
            expect(hash.get(1)).to.be.undefined;
        });

        it("should return undefined when removing a non-existing object", function() {
            expect(hash.remove(1)).to.be.undefined;
        });
    });

    describe("has()", function() {
        it("should confirm/infirm presence of a key", function() {
            expect(hash.has(1)).to.be.false;
            expect(hash.has(2)).to.be.true;
        });
    });
});
