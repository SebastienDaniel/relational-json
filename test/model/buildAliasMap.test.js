var bam = require("../../src/scripts/model/buildAliasMap"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/model/buildModelGraph"),
    graph = require("../data/mixed-graph.json"),
    model = compileModel(graph);

describe("getAliasMap", function() {
    console.log(bam(model["Organization"]));
    
    it("should return tableName when no inheritance", function() {
        expect(bam(model["Entity"]).ExternalLinks).to.eql("ExternalLink");
        expect(bam(model["Entity"]).ExternalEntity).to.eql("ExternalEntity");

        expect(bam(model["Entity"])).to.eql({
            "ExternalLinks": "ExternalLink",
            "ContactValues": "ContactValue",
            "ExternalEntity": "ExternalEntity"
        });

        expect(bam(model["Organization"])).to.eql({
            "ExternalLinks": "ExternalLink",
            "ContactValues": "ContactValue",
            "ExternalEntity": "ExternalEntity",
            "Persons": "Person",
            "ParentOrganization": "Organization",
            "RefIndustry": "RefIndustry",
            "Organizations": "Organization"
        })
    });
});
