var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    rJSON = require("../src/scripts/rJSON.js");

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

