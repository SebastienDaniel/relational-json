var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    rJSON = require("../src/scripts");

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
                    },
                    age: {
                        allowNull: false,
                        dataType: "integer",
                        writable: true,
                        defaultValue: 1
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
        it("prevents property changes", function() {
            db.Industry.get(1).name = "manufacturing";
            assert.equal("agriculture", db.Industry.get(1).name);

            db.Industry.get(1).id = 5;
            assert.equal(1, db.Industry.get(1).id);

            db.SalesSource.get(10).key = "new_key";
            assert.equal("old_key", db.SalesSource.get(10).key);
        });
    });
});

describe("rJSON", function() {
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
