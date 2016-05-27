var expect = require("chai").expect,
    rJSON = require("../../../src/scripts/index.js");

describe("table.put()", function() {
    it("should allow editing non-hierarchical entries", function() {
        var schema = require("../../data/no-relation-graph.json"),
            db = rJSON(schema);

        db.Organization.post({
            entity_id: 1,
            name: "Hosaka"
        });

        db.Person.post({
            entity_id: 2,
            first_name: "Hiro",
            last_name: "Nakamura",
            gender: "m"
        });

        expect(db.Organization.get(1).name).to.eql("Hosaka");
        expect(db.Person.get(2).first_name).to.eql("Hiro");

        db.Organization.put({entity_id:1, name: "Hansoo"});
        db.Person.put({first_name: "Yakuza"}, 2);

        expect(db.Organization.get(1).name).to.eql("Hansoo");
        expect(db.Person.get(2).first_name).to.eql("Yakuza");
    });

    it("should allow editing of hierarchical entries", function() {
        var schema = require("../../data/extension-graph.json"),
            db = rJSON(schema);

        db.Entity.post({
            id: 1,
            deleted: 0
        });

        expect(db.Entity.get(1).deleted).to.eql(0);
        db.Entity.put({deleted:1}, 1);
        expect(db.Entity.get(1).deleted).to.eql(1);

        db.ExternalEntity.post({
            entity_id: 1,
            created_on: "2015-01-01T12:00:00Z",
            created_by: 1
        });

        expect(db.Entity.get(1).deleted).to.eql(1);
        expect(db.ExternalEntity.get(1).created_on).to.eql("2015-01-01T12:00:00Z");

        db.Entity.put({deleted: 0}, 1);
        expect(db.Entity.get(1).deleted).to.eql(0);
        expect(db.ExternalEntity.get(1).created_on).to.eql("2015-01-01T12:00:00Z");

        db.ExternalEntity.put({created_on:"2016-01-01T12:00:00Z"}, 1);
        expect(db.Entity.get(1).deleted).to.eql(0);
        expect(db.ExternalEntity.get(1).created_on).to.eql("2016-01-01T12:00:00Z");

    });
});
