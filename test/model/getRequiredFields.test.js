var grf = require("../../src/scripts/buildModel/Model/getRequiredFields"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/buildModel"),
    graph = require("../data/mixed-graph.json"),
    addExtendedByData = require("../../src/scripts/buildModel/addExtendedByToSchema"),
    model = compileModel(addExtendedByData(graph));

describe("getRequiredFields()", function() {
    it("should return own required field names, ignoring extends & aggregates", function() {
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

    it("should return all required fields, including own, extends & aggregates", function() {
        expect(grf(model["Entity"], "all")).to.have.members(["id"]);
        expect(grf(model["Entity"], "all")).to.have.length(1);

        expect(grf(model["ExternalEntity"], "all")).to.have.members(["entity_id", "created_by", "created_on"]);
        expect(grf(model["ExternalEntity"], "all")).to.have.length(3);

        expect(grf(model["Person"], "all")).to.have.members(["entity_id", "first_name", "last_name", "gender", "created_by", "created_on"]);
        expect(grf(model["Person"], "all")).to.have.length(6);
    });

    it("returned data should be an array of strings", function() {
        grf(model["Person"], "all").forEach(function(f) {
            expect(typeof f).to.be.eql("string");
        });
    });
});
