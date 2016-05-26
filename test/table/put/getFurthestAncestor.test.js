var expect = require("chai").expect,
    model = require("../../../src/scripts/model/buildModelGraph"),
    schema = require("../../data/extension-graph.json"),
    gfa = require("../../../src/scripts/table/put/getFurthestAncestor");

describe("table.put.getFurthestAncestor", function() {
    it("should return object with 'model' & 'row' properties", function() {
        var m = model(schema),
            d = Object.create(null, {
                name: {
                    value: "simple object",
                    enumerable: true
                }
            }),
            ancestor = gfa(m["Entity"], d);

        expect(ancestor).to.be.instanceof(Object);
        expect(ancestor).to.have.keys(["row", "model"]);
        expect(ancestor.model).to.equal(m.Entity);
        expect(ancestor.row).to.equal(d);
    });

    it("should return the row's prototype and prototype's model until prototype is null", function() {
        var m = model(schema),
            entity = Object.create(null, {
                name: {
                    value: "entity",
                    enumerable: true
                }
            }),
            externalEntity = Object.create(entity, {
                name: {
                    value: "external entity",
                    enumerable: true
                }
            }),
            person = Object.create(externalEntity, {
                name: {
                    value: "person",
                    enumerable: true
                }
            });

        // start with furthest ancestor
        expect(gfa(m.Entity, entity)).to.be.instanceof(Object);
        expect(gfa(m.Entity, entity)).to.have.keys(["row", "model"]);
        expect(gfa(m.Entity, entity).model).to.equal(m.Entity);
        expect(gfa(m.Entity, entity).row).to.equal(entity);
        expect(gfa(m.Entity, entity).row.name).to.eql("entity");

        // start 1 child deeper
        expect(gfa(m.ExternalEntity, externalEntity)).to.be.instanceof(Object);
        expect(gfa(m.ExternalEntity, externalEntity)).to.have.keys(["row", "model"]);
        expect(gfa(m.ExternalEntity, externalEntity).model).to.equal(m.Entity);
        expect(gfa(m.ExternalEntity, externalEntity).row).to.equal(entity);
        expect(gfa(m.ExternalEntity, externalEntity).row.name).to.eql("entity");

        // start 2 children deeper
        expect(gfa(m.Person, person)).to.be.instanceof(Object);
        expect(gfa(m.Person, person)).to.have.keys(["row", "model"]);
        expect(gfa(m.Person, person).model).to.equal(m.Entity);
        expect(gfa(m.Person, person).row).to.equal(entity);
        expect(gfa(m.Person, person).row.name).to.eql("entity");
    });

    it("should throw on inconsistent model:object inheritance depth", function() {
        var m = model(schema),
            entity = {
                name: "entity"
            },
            externalEntity = Object.create(entity, {
                name: {
                    value: "external entity",
                    enumerable: true
                }
            }),
            person = Object.create(externalEntity, {
                name: {
                    value: "person",
                    enumerable: true
                }
            });

        // start 2 children deeper
        expect(function() {
            return gfa(m.Person, person);
        }).to.throw(Error);
    });
});