var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    graph = require("./test-graph.json"),
    rJSON = require("../src/scripts");

describe("rJSON", function() {
    var db = rJSON(graph);

    it("should create a Person", function() {
        db.Person.post({
            id:1,
            entity_id: 1,
            first_name: "bob",
            last_name: "builder",
            gender: "m",
            created_on: "2016-01-01T00:00:00Z",
            created_by: 1
        });

        expect(db.Person.get(1)).to.exist;
        expect(db.Person.get(1).first_name).to.eql("bob");
    });

    it("should create an Organization", function() {
        db.Organization.post({
            id: 2,
            entity_id: 2,
            name: "Big Brick Quarry",
            created_on: "2016-01-01T00:00:00Z",
            created_by: 1
        });

        expect(db.Organization.get(2)).to.exist;
        expect(db.Organization.get(2).name).to.eql("Big Brick Quarry");
    });

    it("should update an existing entry for it's basic fields", function() {
        db.Person.put({job_title: "constructor"}, 1);

        expect(db.Person.get(1).job_title).to.eql("constructor");
    });

    it("should update an existing entry with aggregate relations", function() {
       db.Person.put({organization_id:2}, 1);

        expect(db.Person.get(1).organization_id).to.eql(2);
    });
});