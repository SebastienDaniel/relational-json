var gam = require("../../src/scripts/model/getAliasMap"),
    chai = require("chai"),
    expect = require("chai").expect,
    graph = require("../data/test-graph.json");

describe("getAliasMap", function() {
    it("should return tableName when no inheritance", function() {
        expect(gam("Entity", graph).ExternalLinks).to.eql("ExternalLink");
        expect(gam("Entity", graph).ExternalEntity).to.eql("ExternalEntity");
        expect(gam("Entity", graph).InternalEntity).to.eql("InternalEntity");
    });
});
