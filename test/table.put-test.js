var chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./test-graph.json"));

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
        expect(person.first_name).to.eql(db.Person.get(1).first_name);
        expect(person.last_name).to.eql(db.Person.get(1).last_name);
        expect(person.entity_id).to.eql(db.Person.get(1).entity_id);
        expect(person).to.not.equal(db.Person.get(1));
    });

    it("should ignore PUT requests that provide no change to the current primitives", function() {
        var change = db.Person.put({
            first_name: "Sebastien",
            entity_id: 1
        });

        expect(db.Person.get(1)).to.equal(change);
    });

    it("should update parent fields", function() {
        expect(db.ExternalEntity.get(1).created_by).to.eql(2);

        var change = db.Person.put({
            created_by: 3,
            entity_id: 1
        });

        expect(db.ExternalEntity.get(1).created_by).to.eql(3);
    });

    it("shouldn't mutate the provided data object", function() {
        var original = {
            entity_id: 1,
            created_by: 2
        };

        db.Person.put(original);

        expect(original.first_name).not.to.eql("Sebastien");
    });
});
