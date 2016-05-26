var expect = require("chai").expect,
    model = require("../../../src/scripts/buildModel"),
    schema = require("../../data/extension-graph.json"),
    rJSON = require("../../../src/scripts/index.js"),
    getChild = require("../../../src/scripts/table/utils/getChild");

describe("table.put.getChild", function() {
    it("should progressively return the child of a prototype row", function() {
        var db = rJSON(schema),
            m = model(schema);

        // create entry
        db.Person.post({
            entity_id: 1,
            first_name: "seb",
            last_name: "dan",
            gender: "m",
            created_on: "2015-01-01T12:00:00Z",
            created_by: 1
        });

        db.Person.post({
            entity_id: 2,
            first_name: "key",
            last_name: "tay",
            gender: "f",
            created_on: "2016-01-01T12:00:00Z",
            created_by: 1
        });

        // basic tests to make sure we have proper structure
        expect(db.Entity.get(1)).to.exist;
        expect(db.Entity.get(1).deleted).to.eql(0);
        expect(db.ExternalEntity.get(1).created_on).to.eql("2015-01-01T12:00:00Z");
        expect(db.Person.get(1).first_name).to.eql("seb");

        // start proper tests
        // first entry
        expect(getChild(db, m.Person, db.Person.get(1))).to.be.undefined;
        expect(getChild(db, m.ExternalEntity, db.ExternalEntity.get(1)).row).to.equal(db.Person.get(1));
        expect(getChild(db, m.ExternalEntity, db.ExternalEntity.get(1)).model).to.equal(m.Person);
        expect(getChild(db, m.Entity, db.Entity.get(1)).row).to.equal(db.ExternalEntity.get(1));
        expect(getChild(db, m.Entity, db.Entity.get(1)).model).to.equal(m.ExternalEntity);

        // second entry
        expect(getChild(db, m.Person, db.Person.get(2))).to.be.undefined;
        expect(getChild(db, m.ExternalEntity, db.ExternalEntity.get(2)).row).to.equal(db.Person.get(2));
        expect(getChild(db, m.ExternalEntity, db.ExternalEntity.get(2)).model).to.equal(m.Person);
        expect(getChild(db, m.Entity, db.Entity.get(2)).row).to.equal(db.ExternalEntity.get(2));
        expect(getChild(db, m.Entity, db.Entity.get(2)).model).to.equal(m.ExternalEntity);
    });

    it("should return undefined if no child exists", function() {
        var db = rJSON(schema),
            m = model(schema);

        // create entry
        db.ExternalEntity.post({
            entity_id: 1,
            first_name: "seb",
            last_name: "dan",
            gender: "m",
            created_on: "2015-01-01T12:00:00Z",
            created_by: 1
        });

        expect(getChild(db, m.ExternalEntity, db.ExternalEntity.get(1))).to.be.undefined;
    });
});