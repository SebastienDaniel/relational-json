var chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./graph-test.json"));

describe("table.put()", function() {
    it("should update existing objects by creating new objects", function() {
        db.Person.post({
            entity_id: 1,
            first_name: "Sebastien",
            last_name: "Daniel",
            gender: "m",
            created_by: 1,
            created_on: "2015-11-17 16:15:00"
        });

        var entity = db.Entity.get(1),
            externalEntity = db.ExternalEntity.get(1),
            person = db.Person.get(1);

        db.ExternalEntity.put({
            entity_id: 1,
            created_by: 2
        });

        expect(entity).to.not.equal(db.Entity.get(1));
        expect(externalEntity).to.not.equal(db.ExternalEntity.get(1));
        expect(person).to.equal(db.Person.get(1));
    });

    it("should ignore PUT requests that provide no change to the current primitives", function() {
        var change = db.Person.put({
            first_name: "Sebastien",
            entity_id: 1
        });

        expect(db.Person.get(1)).to.equal(change);
    });
});
