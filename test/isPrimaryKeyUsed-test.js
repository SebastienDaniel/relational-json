var isPKused = require("../src/scripts/isPrimaryKeyUsed"),
    chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./test-graph.json"));

describe("isPrimaryKeyUsed", function() {
    var a = [
        {
            id: 1,
            name: "bob"
        },
        {
            id: 2,
            name: "bobby"
        },
        {
            id: 3,
            name: "micky"
        }
    ];

    it("should return an ID comparison by default", function() {
        expect(isPKused(a, 1)).to.be.true;
    });

    it("should return a key comparison by when specified", function() {
        expect(isPKused(a, 1, "id")).to.be.true;
        expect(isPKused(a, "bobby", "name")).to.be.true;
    });

    it("should return false when no match is found", function() {
        expect(isPKused(a, 10)).to.be.false;
    });

    it("should throw when no data or pkValue are specified", function() {
        expect(function() {
            return isPKUsed("id");
        }).to.throw;

        expect(function() {
            return isPKUsed(a);
        }).to.throw;
    });

    it("data creation with existing parent ID in EXTENDS should pass", function() {
        db.ExternalEntity.post({
            entity_id: 11,
            created_by: 1,
            created_on: "2015-01-01T12:30:59"
        });

        expect(db.Person.post({
            entity_id: 11,
            first_name: "Sebastien",
            last_name: "Daniel",
            gender: "m",
            created_by: 1,
            created_on: "2015-01-01T12:30:59"
        })).not.to.throw;
    });

    it("data creation with existing ID shuld throw", function() {
        expect(function() {
            return db.Person.post({
                entity_id: 11,
                first_name: "Sebastien",
                last_name: "Daniel",
                gender: "m",
                created_by: 1,
                created_on: "2015-01-01T12:30:59"
            })
        }).to.throw;
    });
});
