var gam = require("../../src/scripts/model/getAliasMap"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/model/compileModel"),
    graph = require("../data/test-graph.json"),
    model = compileModel(graph);

describe("getAliasMap", function() {
    it("should return tableName when no inheritance", function() {
        expect(gam(model["Entity"]).ExternalLinks).to.eql("ExternalLink");
        expect(gam(model["Entity"]).ExternalEntity).to.eql("ExternalEntity");
        expect(gam(model["Entity"]).InternalEntity).to.eql("InternalEntity");
    });
});
