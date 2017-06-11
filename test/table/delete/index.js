zzvar expect = require("chai").expect,
    schema = require("../../data/mixed-graph.json"),
    rJSON = require("../../../src/scripts/index.js");

describe("table.delete()", function() {
    it("should remove an entry and return it", function() {
        var db = rJSON(schema),
            t1 = db["Person"];

        var bob = t1.post({
            entity_id: 1, 
            first_name: "bob", 
            last_name: "builder", 
            gender: "m", 
            created_on: "2015-01-01T00:00:00Z",
            created_by:1
        });
        var bob2 = t1.post({
            entity_id: 2, 
            first_name: "bob2", 
            last_name: "builder", 
            gender: "m", 
            created_on: "2015-01-01T00:00:00Z",
            created_by:1
        });
        var temp = t1.get(1);

        expect(t1.delete(1)).to.eql(temp);
        expect(t1.get(1)).to.be.undefined;
        expect(t1.get()).to.have.length(1);

        expect(t1.get().every(function(val) {
            return val.entity_id !== 1 && val.first_name !== "molly";
        })).to.be.true;
    });
    
    it("should break top-level referential equality", function() {
        var db = rJSON(schema),
            t1 = db["Person"],
            bob = t1.post({
                entity_id: 1, 
                first_name: "bob", 
                last_name: "builder", 
                gender: "m", 
                created_on: "2015-01-01T00:00:00Z",
                created_by:1
            }),
            bob2 = t1.post({
                entity_id: 2, 
                first_name: "bob2", 
                last_name: "builder", 
                gender: "m", 
                created_on: "2015-01-01T00:00:00Z",
                created_by:1
            }),
            d = t1.get();

        expect(t1.get()).to.equal(d);

        t1.delete(1);
        expect(t1.get()).to.not.equal(d);
    });

    it("should recursively delete a row and its descendants", function() {
        var db = rJSON(schema),
            t1 = db["Person"],
            bob = t1.post({
                entity_id: 1,
                first_name: "bob",
                last_name: "builder",
                gender: "m",
                created_on: "2015-01-01T00:00:00Z",
                created_by:1
            }),
            bob2 = t1.post({
                entity_id: 2,
                first_name: "bob2",
                last_name: "builder",
                gender: "m",
                created_on: "2015-01-01T00:00:00Z",
                created_by:1
            });

        db.ExternalEntity.delete(1);
        expect(db.ExternalEntity.get(1)).to.eql(undefined);
        expect(db.Person.get(1)).to.eql(undefined);

        db.Entity.delete(2);
        expect(db.Entity.get(2)).to.eql(undefined);
        expect(db.ExternalEntity.get(2)).to.eql(undefined);
        expect(db.Person.get(2)).to.eql(undefined);
    });
});
