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
                    },
                    created_on: {
                        allowNull: true,
                        defaultValue: null,
                        dataType: "datetime",
                        writable: true
                    },
                    started_on: {
                        allowNull: true,
                        defaultValue: null,
                        dataType: "date",
                        writable: true
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

    describe("setting values", function() {
        it("should allow valid data", function() {
            db.Industry.get(1).name = "administration";
            assert.equal("administration", db.Industry.get(1).name);

            assert.equal(null, db.SalesSource.get(10).started_on);
            db.SalesSource.get(10).started_on = "2015-01-01";
            assert.equal("2015-01-01", db.SalesSource.get(10).started_on);
        });

        it("should ignore invalid data", function() {
            db.Industry.get(1).name = 1;
            assert.equal("administration", db.Industry.get(1).name);
        });
    });
});

describe("dataType control", function() {
    var graph = {
            awesome: {
                primary: "integer",
                fields: {
                    integer: {
                        dataType: "integer",
                        allowNull: false,
                        writable: true
                    },
                    string: {
                        dataType: "string",
                        allowNull: false,
                        writable: true
                    },
                    boolean: {
                        dataType: "boolean",
                        allowNull: false,
                        writable: true
                    },
                    date: {
                        dataType: "date",
                        allowNull: false,
                        writable: true
                    },
                    time: {
                        dataType: "time",
                        allowNull: false,
                        writable: true
                    },
                    datetime: {
                        dataType: "datetime",
                        allowNull: false,
                        writable: true
                    },
                    float: {
                        dataType: "float",
                        allowNull: false,
                        writable: true
                    }
                }
            }
        },
        db = rJSON(graph);

    db.awesome.post({
        integer: 1,
        string: "bob",
        float: 1.11,
        date: "2015-01-01",
        time: "13:24:55",
        datetime: "2015-01-01 13:24:55",
        boolean: true
    });

    it("should control integer", function() {
        var now = db.awesome.get(1);

        expect(now.integer).to.equal(1);

        now.integer = 2;
        expect(now.integer).to.equal(2);
        expect(db.awesome.get(2).integer).to.equal(2);

        now.integer = 0;
        expect(now.integer).to.equal(0);
        expect(db.awesome.get(0).integer).to.equal(0);

        // should be rejected
        now.integer = -1;
        expect(now.integer).to.equal(-1);
        expect(db.awesome.get(-1).integer).to.equal(-1);

        now.integer = 0;
        // should be rejected
        now.integer = "1";
        expect(now.integer).to.equal(0);
        expect(db.awesome.get(0).integer).to.equal(0);

        // should be accepted, it is float notation but is a valid integer value
        now.integer = 2.0000;
        expect(now.integer).to.equal(2);
        expect(db.awesome.get(2).integer).to.equal(2);

        // should be rejected
        now.integer = 3.000000001;
        expect(now.integer).to.equal(2);
        expect(db.awesome.get(2).integer).to.equal(2);

        // should be rejected
        now.integer = true;
        expect(now.integer).to.equal(2);
        expect(db.awesome.get(2).integer).to.equal(2);

        // should be rejected
        now.integer = false;
        expect(now.integer).to.equal(2);
        expect(db.awesome.get(2).integer).to.equal(2);
    });

    it("should control string", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.string = true;
        expect(now.string).to.equal("bob");
        expect(db.awesome.get(2).string).to.equal("bob");

        // should be rejected
        now.string = false;
        expect(now.string).to.equal("bob");
        expect(db.awesome.get(2).string).to.equal("bob");

        // should be rejected
        now.string = 1;
        expect(now.string).to.equal("bob");
        expect(db.awesome.get(2).string).to.equal("bob");

        // should be rejected
        now.string = 1.0001;
        expect(now.string).to.equal("bob");
        expect(db.awesome.get(2).string).to.equal("bob");

        // should be accepted
        now.string = "1";
        expect(now.string).to.equal("1");
        expect(db.awesome.get(2).string).to.equal("1");
    });

    it("should control float", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.float = true;
        expect(now.float).to.equal(1.11);
        expect(db.awesome.get(2).float).to.equal(1.11);

        // should be rejected
        now.float = false;
        expect(now.float).to.equal(1.11);
        expect(db.awesome.get(2).float).to.equal(1.11);

        // should be rejected
        now.float = "1.01";
        expect(now.float).to.equal(1.11);
        expect(db.awesome.get(2).float).to.equal(1.11);

        // should be accepted
        now.float = 1;
        expect(now.float).to.equal(1);
        expect(db.awesome.get(2).float).to.equal(1);
        expect(now.float).to.equal(1.00);
        expect(db.awesome.get(2).float).to.equal(1.00);

        // should be accepted
        now.float = 2.221;
        expect(now.float).to.equal(2.221);
        expect(db.awesome.get(2).float).to.equal(2.221);
    });

    it("should control date", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.date = 1;
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "1";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = true;
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = false;
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = 1.001;
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "2015";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "2015-01";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "01-01-2015";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "2015-13-03";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "2015-02-31";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be rejected
        now.date = "2015-01-00";
        expect(now.date).to.equal("2015-01-01");
        expect(db.awesome.get(2).date).to.equal("2015-01-01");

        // should be accepted
        now.date = "2015-03-03";
        expect(now.date).to.equal("2015-03-03");
        expect(db.awesome.get(2).date).to.equal("2015-03-03");

        // should be accepted
        now.date = "2015-12-12";
        expect(now.date).to.equal("2015-12-12");
        expect(db.awesome.get(2).date).to.equal("2015-12-12");

    });

    it("should control time", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.time = 10;
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = 10.01;
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = "10";
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = "10.01.01";
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = true;
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = false;
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = "10:10:";
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be rejected
        now.time = "25:10:10";
        expect(now.time).to.equal("13:24:55");
        expect(db.awesome.get(2).time).to.equal("13:24:55");

        // should be accepted
        now.time = "10:10:10";
        expect(now.time).to.equal("10:10:10");
        expect(db.awesome.get(2).time).to.equal("10:10:10");

        // should be accepted
        now.time = "10:10:10.333";
        expect(now.time).to.equal("10:10:10.333");
        expect(db.awesome.get(2).time).to.equal("10:10:10.333");
    });

    it("should control datetime", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.datetime = 1;
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = true;
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = false;
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = "10";
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = "2015-01-02";
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = 1.00;
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = "2015-01-02  20:20:00";
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be rejected
        now.datetime = "2015-01-02  20:20:00";
        expect(now.datetime).to.equal("2015-01-01 13:24:55");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 13:24:55");

        // should be accepted
        now.datetime = "2015-01-01 23:59:59";
        expect(now.datetime).to.equal("2015-01-01 23:59:59");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 23:59:59");

        // should be accepted
        now.datetime = "2015-01-01T23:59:59";
        expect(now.datetime).to.equal("2015-01-01T23:59:59");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01T23:59:59");

        // should be accepted
        now.datetime = "2015-01-01 23:59:59.123Z";
        expect(now.datetime).to.equal("2015-01-01 23:59:59.123Z");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01 23:59:59.123Z");

        // should be accepted
        now.datetime = "2015-01-01T23:59:59.123Z";
        expect(now.datetime).to.equal("2015-01-01T23:59:59.123Z");
        expect(db.awesome.get(2).datetime).to.equal("2015-01-01T23:59:59.123Z");
    });

    it("should control boolean", function() {
        var now = db.awesome.get(2);

        // should be rejected
        now.boolean = "1";
        expect(db.awesome.get(2).boolean).to.equal(true);
        expect(now.boolean).to.equal(true);

        // should be rejected
        now.boolean = "0";
        expect(db.awesome.get(2).boolean).to.equal(true);
        expect(now.boolean).to.equal(true);

        // should be rejected
        now.boolean = 10;
        expect(db.awesome.get(2).boolean).to.equal(true);
        expect(now.boolean).to.equal(true);

        // should be rejected
        now.boolean = 0.0001;
        expect(db.awesome.get(2).boolean).to.equal(true);
        expect(now.boolean).to.equal(true);

        // should be accepted
        now.boolean = 1;
        expect(db.awesome.get(2).boolean).to.equal(1);
        expect(now.boolean).to.equal(1);

        // should be accepted
        now.boolean = 0;
        expect(db.awesome.get(2).boolean).to.equal(0);
        expect(now.boolean).to.equal(0);

        // should be accepted
        now.boolean = false;
        expect(db.awesome.get(2).boolean).to.equal(false);
        expect(now.boolean).to.equal(false);
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
describe("aggregation", function() {
    var graph = {
        "Entity": {
            "fields": {
                "id": {
                    "allowNull": false,
                    "dataType": "integer",
                    "writable": false
                }
            },
            "primary": "id",
            "aggregates": [
                {
                    "foreignTable": "ExternalLink",
                    "localField": "id",
                    "alias": "ExternalLinks",
                    "foreignField": "entity_id",
                    "cardinality": "many"
                },
                {
                    "foreignTable": "ContactValue",
                    "localField": "id",
                    "alias": "ContactValues",
                    "foreignField": "entity_id",
                    "cardinality": "many"
                }
            ]
        },
        "ContactValue": {
            "fields": {
                "id": {
                    "allowNull": false,
                    "dataType": "integer",
                    "writable": false
                },
                "entity_id": {
                    "allowNull": false,
                    "dataType": "integer",
                    "writable": true
                }
            },
            "primary": "id",
            "aggregates": [
                {
                    "foreignTable": "Entity",
                    "localField": "entity_id",
                    "alias": "Entity",
                    "foreignField": "id",
                    "cardinality": "single"
                }
            ]
        },
        "ExternalLink": {
            "fields": {
                "id": {
                    "allowNull": false,
                    "dataType": "integer",
                    "writable": false
                },
                "entity_id": {
                    "allowNull": false,
                    "dataType": "integer",
                    "writable": true
                }
            },
            "primary": "id",
            "aggregates": [
                {
                    "foreignTable": "Entity",
                    "localField": "entity_id",
                    "alias": "Entity",
                    "foreignField": "id",
                    "cardinality": "single"
                }
            ]
        }
        },
        db = rJSON(graph);

    // make sure all 3 tables exist
    it("should contain all necessary tables", function() {
        should.exist(db.Entity);
        should.exist(db.ContactValue);
        should.exist(db.ExternalLink);
    });

    it("should create data", function() {
        // 2 external values for entity
        // 1 external value NOT for entity
        db.ExternalLink.post({id:1, entity_id:1});
        db.ExternalLink.post({id:2, entity_id:1});
        db.ExternalLink.post({id:3, entity_id:2});

        should.exist(db.ExternalLink.get(1));
        should.exist(db.ExternalLink.get(2));
        should.exist(db.ExternalLink.get(3));

        // 2 ContactValues for entity
        // 1 ContactValue NOT for entity
        db.ContactValue.post({id:1, entity_id:1});
        db.ContactValue.post({id:2, entity_id:1});
        db.ContactValue.post({id:3, entity_id:2});

        should.exist(db.ContactValue.get(1));
        should.exist(db.ContactValue.get(2));
        should.exist(db.ContactValue.get(3));
    });

    // check that external entity has the proper values for each
    it("should maintain data relations", function() {
        db.Entity.post({id:1});

        should.exist(db.Entity.get(1));
        assert.lengthOf(db.Entity.get(1).ContactValues, 2);
        assert.lengthOf(db.Entity.get(1).ExternalLinks, 2);
        assert.ok(db.Entity.get(1).ContactValues.every(function(cv) { return cv.id === 1 || cv.id === 2;}), "bad relation");
        assert.ok(db.Entity.get(1).ExternalLinks.every(function(exl) { return exl.id === 1 || exl.id === 2;}), "bad relation");

        assert.isObject(db.ContactValue.get(1).Entity);
        assert.isObject(db.ExternalLink.get(1).Entity);

        assert.isUndefined(db.ContactValue.get(3).Entity);
        assert.isUndefined(db.ExternalLink.get(3).Entity);
    });
});

