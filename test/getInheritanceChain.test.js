var gic = require("../src/scripts/model/getInheritanceChain"),
    chai = require("chai"),
    expect = require("chai").expect,
    graph = require("./test-graph.json");

describe("getInheritanceChain", function() {
    it("should return tableName when no inheritance", function() {
        expect(gic("Entity", graph)).to.have.members(["Entity"]);
        expect(gic("Entity", graph)).to.have.length(1);
    });

    it("should return full inheritance chain", function() {
        expect(gic("Person", graph)).to.eql(["Person", "ExternalEntity", "Entity"]);
    });
});
