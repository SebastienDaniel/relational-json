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

    describe("getPrimaryField", function() {
        it("should return tables' primary field", function() {
            assert.equal("id", db.Industry.getPrimaryField());
            assert.equal("id", db.SalesSource.getPrimaryField());
        });
    });
});
