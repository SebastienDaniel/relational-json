var chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./test-graph.json"));

describe("immutability", function() {
    var p = db.Person.post({
        entity_id: 11,
        first_name: "Sebastien",
        last_name: "Daniel",
        gender: "m",
        created_by: 1,
        created_on: "2015-01-01T12:30:59"
    });

    it("should get Child from Parent", function() {
        "use strict";

        expect(db.Entity.get(11).ExternalEntity.Person).to.eql(p);
        expect(db.Entity.get(11).ExternalEntity.Person).to.equal(p);
    });
});
