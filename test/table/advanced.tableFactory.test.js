var chai = require("chai"),
    expect = chai.expect,
    graph = require("../data/mixed-graph.json"),
    rJSON = require("../../src/scripts/index");

var db = rJSON(graph),
    t1 = db["Person"];

describe("advanced table", function() {
    describe("table.post()", function() {
        it("should allow data creation (post)", function() {
            var bob = t1.post({
                entity_id: 1,
                first_name: "bob",
                last_name: "builder",
                gender: "m",
                created_on: "2015-01-01T00:00:00Z",
                created_by: 2
            });

            expect(bob).to.exist;
            expect(bob.entity_id).to.eql(1);
        });
        it("should throw on duplicate post", function() {
            expect(function() {
                return t1.post({id: 1, name: "bobby", created_on: "2015-12-01T00:00:00Z"});
            }).to.throw(Error);
        });
        it("should have created all ancestors (if non-existent) when creating a child", function() {
            expect(db["Entity"].get(1)).to.exist;
            expect(db["ExternalEntity"].get(1)).to.exist;
            expect(db["ExternalEntity"].get(1).created_on).to.eql(db["Person"].get(1).created_on);
        });
        it("should not create children when creating a middle-man ancestor", function() {
            var ext = db["ExternalEntity"].post({
                entity_id: 11,
                created_on: "2016-01-01T00:00:00Z",
                created_by: 2
            });

            console.log(db["Entity"].get(1));
            console.log(db["Entity"].get(1).ExternalEntity);
            console.log(db["ExternalEntity"].get(1).Entity);
            console.log(db["Person"].get(1));
            expect(db["ExternalEntity"].get(11)).to.eql(ext);
            expect(db["ExternalEntity"].get(11).Entity).to.exist;
            expect(db["Entity"].get(11)).to.exist;
            expect(db["Person"].get(11)).to.not.exist;
            expect(db["Organization"].get(11)).to.not.exist;
        });
        it("should allow progressive creation of children", function() {
            var alice = db["Person"].post({
                    entity_id: 11,
                    first_name: "alice",
                    last_name: "wonder",
                    gender: "f"
                }),
                parent = db["ExternalEntity"].get(11);

            expect(db["ExternalEntity"].get(11).Person).to.eql(alice);
            expect(db["Person"].get(11).ExternalEntity).to.eql(parent);
        });
    });

    describe("table.delete()", function() {
        it("should remove row and row's children, but not ancestors", function() {
            var ext = db["ExternalEntity"].delete(1);

            expect(db["Entity"].get(1)).to.exist;
            //expect(ext.Entity).to.eql(db["Entity"].get(1));
            expect(db["ExternalEntity"].get(1)).to.not.exist;
            expect(db["Person"].get(1)).to.not.exist;
        });
    });
    /*
     describe("table.put()", function() {
     it("should update an object's data", function() {
     t1.put({entity_id: 1, first_name: "mike"});
     expect(t1.get(1).first_name).to.eql("mike");
     });
     it("should re-create the object, breaking past reference", function() {
     var old = t1.get(1);

     t1.put({entity_id: 1, first_name: "molly"});
     expect(t1.get(1).first_name).to.eql("molly");
     expect(t1.get(1)).to.not.eql(old);
     });
     });
     */

    // additional generic tests (relations)
});
