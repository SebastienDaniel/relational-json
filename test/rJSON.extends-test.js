var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    rJSON = require("../src/scripts/rJSON.js");

// Extension
describe("rJSON extension", function() {
    var graph = {
            Client: {
                primary: "id",
                extends: {
                    table: "Person",
                    local: "id",
                    foreign: "person_id"
                },
                fields: {
                    id: {
                        dataType: "integer",
                        writable: false,
                        allowNull: false
                    }
                }
            },
            Person: {
                primary: "person_id",
                fields: {
                    person_id: {
                        dataType: "integer",
                        writable: false,
                        allowNull: false
                    },
                    name: {
                        dataType: "string",
                        writable: true,
                        allowNull: false
                    },
                    age: {
                        dataType: "integer",
                        writable: true,
                        allowNull: false
                    }
                },
                extends: {
                    table: "People",
                    local: "person_id",
                    foreign: "id"
                }
            },
            People: {
                primary: "id",
                fields: {
                    id: {
                        dataType: "integer",
                        writable: false,
                        allowNull: false
                    },
                    created_on: {
                        dataType: "string",
                        writable: true,
                        allowNull: false
                    }
                }
            }
        },
        db = rJSON(graph);

    db.Person.post({id:1,name:"bob",age:30,created_on:"2015-01-01"});


    it("should list required fields by taking inheritance into account", function() {
        expect(db.Person.getRequiredFields()).to.eql(["name", "age", "id", "created_on"]);
        expect(db.Client.getRequiredFields()).to.eql(["name", "age", "id", "created_on"]);
    });

    it("should allow field inheritance", function() {
        expect(db.Person.get(1).created_on).to.equal("2015-01-01");
        expect(db.Person.get(1).id).to.equal(1);
    });

    it("should get PK from ancestor", function() {
        expect(db.Person.get(1).id).to.equal(1);
        expect(db.Person.get(1).person_id).to.equal(1);
    });

    it("fields should not be ownProperties", function() {
        expect(Object.hasOwnProperty.call(db.Person.get(1),"name")).to.be.true;
        expect(Object.hasOwnProperty.call(db.Person.get(1),"created_on")).not.to.be.true;
        expect(Object.hasOwnProperty.call(db.Person.get(1),"id")).not.to.be.true;
    });

    it("ancestor fields should be modifiable from child face", function() {
        db.Person.get(1).created_on = "2016-01-01";
        expect(db.Person.get(1).created_on).to.equal("2016-01-01");
        expect(db.People.get(1).created_on).to.equal("2016-01-01");
    });

    it("should get parent", function() {
        expect(db.Person.getExtensionInfo().table).to.equal("People");
        expect(db.Person.getExtensionInfo().local).to.equal("person_id");
        expect(db.Person.getExtensionInfo().foreign).to.equal("id");
    });

    it("should ignore missing extension field", function() {
        expect(function() {
            db.Person.post({id:2,name:"bobbine",age:20,created_on:"2015-03-10"});
        }).to.not.throw('all good');

        expect(db.Person.get(2).name).to.equal("bobbine");
    });

    it("should list proper inheritance chain", function() {
        expect(db.Client.getInheritanceChain()).to.eql(["Client", "Person", "People"]);
        expect(db.Person.getInheritanceChain()).to.eql(["Person", "People"]);
        expect(db.People.getInheritanceChain()).to.eql(["People"]);
    });
});
