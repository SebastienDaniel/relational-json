var expect = require("chai").expect,
    schema = require("./data/mixed-graph.json"),
    rjson = require("../src/scripts/index.js"),
    dbMapper = function dbMapper(db) {
        return Object.keys(db).reduce(function(obj, key) {
            // get all table data
            obj[key] = db[key].get().map(function(v) {
                // show only own props for each table row
                return Object.keys(v).reduce(function(o, k) {
                    o[k] = v[k];

                    return o;
                }, {});
            });

            return obj;
        }, {});
    };

describe("relational-json, immutability", function() {
    it("should provide immutability at the top level (data container)", function() {
        var db = rjson(schema),
            mem;

        // create initial data
        db.Person.post({
            entity_id: 1,
            first_name: "seb",
            last_name: "dan",
            gender: "m",
            created_on: "2016-01-01T12:00:00Z",
            created_by: 2
        });

        expect(db.Person.get()).to.eql(db.Person.get());
        expect(db.Person.get()).to.equal(db.Person.get());

        // store current value
        mem = db.Person.get();

        // change the data
        db.Person.put({entity_id: 1, first_name: "bob"});

        // test equalities
        expect(db.Person.get()).to.have.length(1);
        expect(db.Person.get()).to.not.equal(mem);
        expect(db.Person.get(1)).to.not.equal(mem[0]);
        expect(db.Person.get(1)).to.equal(db.Person.get()[0]);

        expect(db.Person.get(1).first_name).to.eql("bob");
        expect(mem[0].first_name).to.eql("seb");
    });

    it("should provide hierarchical immutability on PUT operations", function() {
        var db = rjson(schema),
            mem;

        // create initial data
        db.Person.post({
            entity_id: 1,
            first_name: "seb",
            last_name: "dan",
            gender: "m",
            created_on: "2016-01-01T12:00:00Z",
            created_by: 2
        });

        mem = db.Person.get(1);

        // modify parent
        //db.ExternalEntity.put({entity_id: 1, created_on: "2017-01-01T12:00:00Z"});

        //console.log(dbMapper(db));
        console.log(db.ExternalEntity.meta.aliasMap);

        expect(db.Person.get()[0]).to.equal(mem);
        expect(db.Person.get(1)).to.not.equal(mem);
    });
});