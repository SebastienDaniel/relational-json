var grf = require("../../src/scripts/model/getRequiredFields"),
    chai = require("chai"),
    expect = require("chai").expect,
    compileModel = require("../../src/scripts/model/compileModel"),
    graph = require("../data/test-graph.json"),
    model = compileModel(graph);

describe("getRequiredFields", function() {
    it("should return own required fields for a given Table", function() {
        expect(grf("own", model["Entity"])).to.have.members(["id"]);
        expect(grf("own", model["Entity"])).to.have.length(1);
    });

    it("should return own required fields \n\t& parent required fields\n\t& exclude extension fields of child", function() {
        expect(grf("all", model.InternalEntity)).to.have.members(["created_on", "entity_id"]);
        expect(grf("all", model.InternalEntity)).to.have.length(2);

        expect(grf("all", model.ExternalEntity)).to.have.members(["created_on", "created_by", "entity_id"]);
        expect(grf("all", model.ExternalEntity)).to.have.length(3);

        expect(grf("all", model.Person)).to.have.members(["entity_id", "created_on", "created_by", "first_name", "last_name", "gender"]);
        expect(grf("all", model.Person)).to.have.length(6);
    });
});
