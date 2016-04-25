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

            expect(db["ExternalEntity"].get(11)).to.eql(ext);
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
        it("shouldn't create two children using same prototype parent", function() {
            var p = db["Person"].post({
                entity_id: 8,
                first_name: "person",
                last_name: "one",
                gender: "m",
                created_on: "2015-01-01T00:00:00Z",
                created_by: 2
            });

            expect(function() {
                return db["Organization"].post({
                    entity_id: 8,
                    name: "organization",
                    created_on: "2015-01-01T00:00:00Z",
                    created_by: 2
                });
            }).to.throw(Error);
        });
    });

    describe("table.delete()", function() {
        it("should remove row and row's children, but not ancestors", function() {
            var ext = db["ExternalEntity"].delete(1);

            expect(db["Entity"].get(1)).to.exist;
            expect(db["ExternalEntity"].get(1)).to.not.exist;
            expect(db["Person"].get(1)).to.not.exist;
        });
    });

     describe("table.put()", function() {
         t1.post({
             entity_id: 3,
             first_name: "bob",
             last_name: "builder",
             gender: "m",
             created_on: "2015-01-01T00:00:00Z",
             created_by: 2
         });

         it("should update an object's data", function() {
             t1.put({entity_id: 3, first_name: "mike"});
             expect(t1.get(3).first_name).to.eql("mike");
             expect(t1.get(3).last_name).to.eql("builder");
             expect(t1.get(3).organization_id).to.eql(null);
         });
         it("should preserve the object's relations", function() {
             expect(db.ExternalEntity.get(3).Person).to.eql(db.Person.get(3));
         });

         it("should re-create the object, breaking past reference", function() {
             var old = t1.get(3);

             t1.put({entity_id: 3, first_name: "molly"});
             expect(t1.get(3).first_name).to.eql("molly");
             expect(t1.get(3)).to.not.eql(old);
         });
         it("should dispatch updates to all rows in family-line", function(){
             db["Person"].post({
                 entity_id: 7,
                 first_name: "kandice",
                 last_name: "miller",
                 gender: "m",
                 created_on: "2015-01-01T00:00:00Z",
                 created_by: 2
             });

             expect(db["Entity"].get(7).deleted).to.eql(0);
             expect(db["ExternalEntity"].get(7).created_on).to.eql("2015-01-01T00:00:00Z");
             expect(db["Person"].get(7).first_name).to.eql("kandice");

             // complex put
             db["Person"].put({entity_id:7, first_name:"miley", deleted:1});
             expect(db["Person"].get(7).first_name).to.eql("miley");
             expect(db["Entity"].get(7).deleted).to.eql(1);
         });

         it("shouldn't change the row if the data doesn't differ", function() {
             var p = db["Person"].post({
                     entity_id: 17,
                     first_name: "kandice",
                     last_name: "miller",
                     gender: "m",
                     created_on: "2015-01-01T00:00:00Z",
                     created_by: 2
                 }),
                 p2 = db["Person"].put({entity_id: 17, first_name: "kandice"});

             expect(p2).to.equal(p);
         });
     });
});
