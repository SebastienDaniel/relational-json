var expect = require("chai").expect,
    rJSON = require("../../src/scripts"),
    schema = require("../data/no-relation-graph.json");

describe("tableFactory()", function() {
    var db = rJSON(schema);
        t1 = db["Person"];

    it("should create a Table", function() {
        expect(t1).to.exist;
        expect(t1).have.ownProperty("get");
        expect(t1).have.ownProperty("post");
        expect(t1).have.ownProperty("put");
        expect(t1).have.ownProperty("delete");
        expect(t1).have.ownProperty("meta");
        expect(Object.keys(t1)).to.have.length(5);
    });
    
    it("table should not be modifiable", function() {
        t1.get = "boo";
        expect(typeof t1.get).to.eql("function");

        delete t1.get;
        expect(typeof t1.get).to.eql("function");

        t1.test = "test";
        expect(t1.test).to.eql(undefined);
    });
});