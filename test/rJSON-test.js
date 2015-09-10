var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    rJSON = require("../src/scripts/rJSON.js");

describe("rJSON", function() {
    var graph = {
            Industry: {
                "fields": {
                    "id": {
                        "allowNull": false,
                        "dataType": "integer",
                        "writable": false
                    },
                    "name": {
                        "allowNull": false,
                        "dataType": "string",
                        "writable": true
                    }
                },
                "primary": "id"
            },
            "SalesSource": {
                "fields": {
                    "id": {
                        "allowNull": false,
                        "dataType": "integer",
                        "writable": false
                    },
                    "key": {
                        "allowNull": false,
                        "dataType": "string",
                        "writable": false
                    }
                },
                "primary": "id"
            }
        },
        db = rJSON(graph);

    // no FK
    it("should generate simple tables with no relations", function() {
        // has graph created?
        should.exist(db.Industry);
        should.exist(db.SalesSource);
        // test data edit
    });

    // test data creation
    describe("post()", function() {
        it("allows data creation", function() {
            db.Industry.post({id: 1, name: "agriculture"});
            db.SalesSource.post({id: 10, key: "old_key"});
            assert.equal("agriculture", db.Industry.get(1).name);
            assert.equal(1, db.Industry.get(1).id);

            assert.equal("old_key", db.SalesSource.get(10).key);
            assert.equal(10, db.SalesSource.get(10).id);
        });
    });

    describe("get()", function() {
        it("allows property changes", function() {
            db.Industry.get(1).name = "manufacturing";
            assert.equal("manufacturing", db.Industry.get(1).name);
        });

        it("prevents read-only property changes", function() {
            db.Industry.get(1).id = 5;
            assert.equal(1, db.Industry.get(1).id);

            db.SalesSource.get(10).key = "new_key";
            assert.equal("old_key", db.SalesSource.get(10).key);
        });
    });
});


// Extension
describe("rJSON extension", function() {
    var graph = {
            Person: {
                primary: "id",
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

    db.Person.post({person_id:1,name:"bob",age:30,created_on:"2015-01-01"});

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
});

// Aggregation

