var bam = require("../../src/scripts/model/buildAliasMap"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/model/buildModelGraph"),
    graph = require("../data/test-graph.json"),
    model = compileModel(graph);

describe("getAliasMap", function() {
    it("should return tableName when no inheritance", function() {
        expect(bam(model["Entity"]).ExternalLinks).to.eql("ExternalLink");
        expect(bam(model["Entity"]).ExternalEntity).to.eql("ExternalEntity");
        expect(bam(model["Entity"]).InternalEntity).to.eql("InternalEntity");
    });
});
