var chai = require("chai"),
    expect = chai.expect,
    tf = require("../../src/scripts/table/tableFactory");

describe("tableFactory()", function() {
    var db = {},
        graph = {
            Table1: {
                primary: "id",
                fields: {
                    id: {
                        dataType: "integer",
                        allowNull: false,
                        writable: false
                    },
                    name: {
                        dataType: "string",
                        allowNull: false,
                        writable: true
                    },
                    created_on: {
                        dataType: "datetime",
                        allowNull: false,
                        writable: false
                    }
                }
            },
            Table2: {
                primary: "id",
                fields: {
                    id: {
                        dataType: "integer",
                        allowNull: false,
                        writable: false
                    },
                    age: {
                        dataType: "integer",
                        allowNull: false,
                        writable: true
                    }
                }
            }
        };

    // create table 1
    var t1 = db["Table1"] = tf("Table1", graph, db);

    it("should create a Table", function() {
        expect(t1).to.exist;
        expect(t1).have.ownProperty("get");
        expect(t1).have.ownProperty("post");
        expect(t1).have.ownProperty("put");
        expect(t1).have.ownProperty("delete");
        expect(t1).have.ownProperty("meta");
        expect(Object.keys(t1)).to.have.length(5);
    });
    it("table should not be modifiable", function() {
        t1.get = "boo";
        expect(typeof t1.get).to.eql("function");

        delete t1.get;
        expect(typeof t1.get).to.eql("function");

        t1.test = "test";
        expect(t1.test).to.eql(undefined);
    });

    it("should allow data creation (post)", function() {
        var bob = t1.post({id: 1, name: "bob", created_on: "2015-01-01T00:00:00Z"});

        expect(bob).to.exist;
        expect(bob.id).to.eql(1);
        expect(bob.name).to.eql("bob");
    });
    it("should throw on duplicate post", function() {
        expect(function() {
            return t1.post({id: 1, name: "bobby", created_on: "2015-12-01T00:00:00Z"});
        }).to.throw;
    });
    it("should allow data retrieval (get)", function() {
        // get instance
        expect(t1.get(1)).to.have.keys("id", "name", "created_on");
        expect(t1.get(1).name).to.eql("bob");

        // get all data
        expect(t1.get()).to.have.length(1);
        expect(t1.get()[0].name).to.eql("bob");
    });
    it("should prevent data tampering, even when getting all", function() {
        t1.get(1).name = "mike";
        expect(t1.get(1).name).to.eql("bob");

        t1.get().splice(0, 1);
        expect(t1.get()).to.have.length(1);
        expect(t1.get()[0].name).to.eql("bob");
    });
});
