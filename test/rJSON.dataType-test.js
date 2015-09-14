var assert = require("chai").assert,
    should = require("chai").should(),
    expect = require("chai").expect,
    rJSON = require("../src/scripts/rJSON.js");

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
