var grf = require("../src/scripts/model/getRequiredFields"),
    chai = require("chai"),
    expect = require("chai").expect,
    graph = require("./test-graph.json");

describe("getRequiredFields", function() {
    it("should return own required fields for a given Table", function() {
        expect(grf(graph.Entity, graph)).to.have.members(["id"]);
        expect(grf(graph.Entity, graph)).to.have.length(1);
    });

    it("should return own required fields \n\t& parent required fields\n\t& exclude extension fields of child", function() {
        expect(grf(graph.InternalEntity, graph)).to.have.members(["created_on", "entity_id"]);
        expect(grf(graph.InternalEntity, graph)).to.have.length(2);

        expect(grf(graph.ExternalEntity, graph)).to.have.members(["created_on", "created_by", "entity_id"]);
        expect(grf(graph.ExternalEntity, graph)).to.have.length(3);

        expect(grf(graph.Person, graph)).to.have.members(["entity_id", "created_on", "created_by", "first_name", "last_name", "gender"]);
        expect(grf(graph.Person, graph)).to.have.length(6);
    });
});
