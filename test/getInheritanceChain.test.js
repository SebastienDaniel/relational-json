var gic = require("../src/scripts/model/getInheritanceChain"),
    chai = require("chai"),
    expect = require("chai").expect,
    graph = require("./data/test-graph.json");

describe("getInheritanceChain", function() {
    it("should return own tableName even when no ancestor", function() {
        expect(gic("Entity", graph)).to.have.members(["Entity"]);
        expect(gic("Entity", graph)).to.have.length(1);
    });

    it("should return full inheritance chain (ancestors)", function() {
        expect(gic("Person", graph)).to.eql(["Person", "ExternalEntity", "Entity"]);
    });
});
