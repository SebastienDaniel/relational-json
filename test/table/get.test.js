var expect = require("chai").expect,
    dictionary = require("../../src/scripts/table/dictionaryFactory"),
    get = require("../../src/scripts/table/get"),
    mockData = dictionary();

mockData.set(1, {name: "org1"});
mockData.set(2, {name: "org2"});
mockData.set(3, {name: "org3"});

describe("get()", function() {
    it("should return Array of all data rows, when no argument is provided", function() {
        expect(get(undefined, mockData)).to.be.instanceof(Array);
        expect(get(undefined, mockData).length).to.eql(3);
    });

    it("should return a specific object when id provided", function() {
        expect(get([1], mockData)).to.be.instanceof(Object);
        expect(get([1], mockData).name).to.eql("org1");
        expect(get([2], mockData).name).to.eql("org2");
        expect(get(["3"], mockData).name).to.eql("org3");
    });

    it("should return multiple values (array) if multiple keys provided", function() {
        expect(get([1, "2", "3"], mockData)).to.be.instanceof(Array);
        expect(get([1, 2, 3], mockData)).to.have.length(3);
        expect(get(["1", "2", "3"], mockData)[0].name).to.eql("org1");
        expect(get(["1", 2, 3], mockData)[1].name).to.eql("org2");
        expect(get(["1", 2, 3], mockData)[2].name).to.eql("org3");
    });
});
