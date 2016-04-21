var grf = require("../../src/scripts/model/getRequiredFields"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/model/buildModelGraph"),
    graph = require("../data/mixed-graph.json"),
    model = compileModel(graph);

describe("getRequiredFields('own') & getRequiredFields()", function() {
    it("should return own required fields, ignoring extends & aggregates", function() {
        // using OWN
        expect(grf(model["Entity"], "own")).to.have.members(["id"]);
        expect(grf(model["Entity"], "own")).to.have.length(1);

        expect(grf(model["ExternalEntity"], "own")).to.have.members(["entity_id", "created_by", "created_on"]);
        expect(grf(model["ExternalEntity"], "own")).to.have.length(3);

        expect(grf(model["Person"], "own")).to.have.members(["entity_id", "first_name", "last_name", "gender"]);
        expect(grf(model["Person"], "own")).to.have.length(4);
        
        // no type argument
        expect(grf(model["Entity"])).to.have.members(["id"]);
        expect(grf(model["Entity"])).to.have.length(1);

        expect(grf(model["ExternalEntity"])).to.have.members(["entity_id", "created_by", "created_on"]);
        expect(grf(model["ExternalEntity"])).to.have.length(3);

        expect(grf(model["Person"])).to.have.members(["entity_id", "first_name", "last_name", "gender"]);
        expect(grf(model["Person"])).to.have.length(4);
    });
});

describe("getRequiredFields('all')", function() {
    it("should return all required fields, including own, extends & aggregates", function() {
        expect(grf(model["Entity"], "all")).to.have.members(["id"]);
        expect(grf(model["Entity"], "all")).to.have.length(1);

        expect(grf(model["ExternalEntity"], "all")).to.have.members(["entity_id", "created_by", "created_on"]);
        expect(grf(model["ExternalEntity"], "all")).to.have.length(3);

        expect(grf(model["Person"], "all")).to.have.members(["entity_id", "first_name", "last_name", "gender", "created_by", "created_on"]);
        expect(grf(model["Person"], "all")).to.have.length(6);
    });
});
