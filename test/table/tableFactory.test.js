var chai = require("chai"),
    expect = chai.expect,
    graph = require("../data/no-relation-graph.json"),
    compileModel = require("../../src/scripts/model/buildModelGraph"),
    addExtendedByData = require("../../src/scripts/addExtendedByData"),
    tf = require("../../src/scripts/table/tableFactory"),
    model = compileModel(addExtendedByData(graph));

describe("tableFactory()", function() {
    var db = {},
        t1 = db["Person"] = tf(model["Person"], {
            db: db
        });
    it("should create a Table", function() {
        expect(t1).to.exist;
        expect(t1).have.ownProperty("get");
        expect(t1).have.ownProperty("post");
        expect(t1).have.ownProperty("put");
        expect(t1).have.ownProperty("delete");
        expect(t1).have.ownProperty("meta");
        expect(Object.keys(t1)).to.have.length(6);
    });
    
    it("table should not be modifiable", function() {
        t1.get = "boo";
        expect(typeof t1.get).to.eql("function");

        delete t1.get;
        expect(typeof t1.get).to.eql("function");

        t1.test = "test";
        expect(t1.test).to.eql(undefined);
    });
});

describe("table.post()", function() {
    var db = {},
        t1 = db["Person"] = tf(model["Person"], {
            db: db
        });

    it("should allow data creation (post)", function() {
        var bob = t1.post({entity_id: 1, first_name: "bob", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});

        expect(bob).to.exist;
        expect(bob.entity_id).to.eql(1);
        expect(bob.first_name).to.eql("bob");
    });
    it("should throw on duplicate post", function() {
        expect(function() {
            return t1.post({id: 1, name: "bobby", created_on: "2015-12-01T00:00:00Z"});
        }).to.throw(Error);
    });
    it("should break referential equality", function() {
        var d = t1.get();
        var bob2 = t1.post({entity_id: 2, first_name: "bob2", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});

        expect(t1.get()).to.not.equal(d);
        expect(t1.get()).to.equal(t1.get());
        expect(t1.get()).to.eql(t1.get());
    });
});

describe("table.get()", function() {
    var db = {},
        t1 = db["Person"] = tf(model["Person"], {
            db: db
        });

    var bob = t1.post({entity_id: 1, first_name: "bob", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});

    it("should allow data retrieval (get)", function() {
        // get instance
        expect(t1.get(1)).to.eql({
            entity_id: 1,
            first_name: "bob",
            last_name: "builder",
            gender: "m",
            job_title: null,
            birthdate: null
        });
        expect(t1.get(1).first_name).to.eql("bob");

        // get all data
        expect(t1.get()).to.have.length(1);
        expect(t1.get()[0].first_name).to.eql("bob");
    });
    it("should retrieve all data when get is called without argument", function() {
        expect(t1.get()).to.be.instanceof(Array);
    });
    it("should allow retrieving multiple specific values", function() {
        t1.post({entity_id: 2, first_name: "seb", last_name: "dan", gender: "m", created_on: "2015-01-01T00:00:00Z"});
        t1.post({entity_id: 3, first_name: "vegas", last_name: "the cat", gender: "m", created_on: "2015-01-01T00:00:00Z"});

        expect(t1.get(1, 2)).to.be.instanceof(Array);
        expect(t1.get(1, 3)[0].first_name).to.eql("bob");
        expect(t1.get(1, 3)[1].first_name).to.eql("vegas");
    });
    it("should prevent data tampering, even when getting all", function() {
        t1.get(1).first_name = "mike";
        expect(t1.get(1).first_name).to.eql("bob");

        t1.get().splice(0, 1);
        expect(t1.get()).to.have.length(3);
        expect(t1.get()[0].first_name).to.eql("bob");
    });

    it("should be referentially stable", function() {
        expect(t1.get()).to.equal(t1.get());
    });
});

describe("table.put()", function() {
    var db = {},
        t1 = db["Person"] = tf(model["Person"], {
            db: db
        });

    var bob = t1.post({entity_id: 1, first_name: "bob", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});

    it("should update an object's data", function() {
        t1.put({entity_id: 1, first_name: "mike"});
        expect(t1.get(1).first_name).to.eql("mike");
    });
    it("should re-create the object, breaking past reference", function() {
        var old = t1.get(1);

        t1.put({entity_id: 1, first_name: "molly"});
        expect(t1.get(1).first_name).to.eql("molly");
        expect(t1.get(1)).to.not.eql(old);
    });
    it("should break referential equality", function() {
       var d = t1.get();
        expect(t1.get()).to.equal(t1.get());
        t1.put({entity_id: 1, first_name: "molly 2"});
        expect(t1.get()).to.not.equal(d);
    });
});

describe("table.delete()", function() {
    it("should remove an entry and return it", function() {
        var db = {},
            t1 = db["Person"] = tf(model["Person"], {
                db: db
            });

        var bob = t1.post({entity_id: 1, first_name: "bob", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});
        var bob2 = t1.post({entity_id: 2, first_name: "bob2", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"});
        var temp = t1.get(1);

        expect(t1.delete(1)).to.eql(temp);
        expect(t1.get(1)).to.be.undefined;
        expect(t1.get()).to.have.length(1);

        expect(t1.get().every(function(val) {
            return val.entity_id !== 1 && val.first_name !== "molly";
        })).to.be.true;
    });

    it("should break referential equality", function() {
        var db = {},
            t1 = db["Person"] = tf(model["Person"], {
                db: db
            }),
            bob = t1.post({entity_id: 1, first_name: "bob", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"}),
            bob2 = t1.post({entity_id: 2, first_name: "bob2", last_name: "builder", gender: "m", created_on: "2015-01-01T00:00:00Z"}),
            d = t1.get();

        expect(t1.get()).to.equal(d);

        t1.delete(1);
        expect(t1.get()).to.not.equal(d);
    });
});
