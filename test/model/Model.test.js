var expect = require("chai").expect,
    schema = require("../data/mixed-graph.json"),
    addExtendedByData = require("../../src/scripts//buildModel/addExtendedByToSchema"),
    Field = require("../../src/scripts/buildModel/Model/Field"),
    Model = require("../../src/scripts/buildModel/Model");

describe("new Model()", function() {
    schema = addExtendedByData(schema);
    
    var m = new Model("Person", schema["Person"]);

    it("should generate a model object", function() {
        expect(typeof m).to.eql("object");
        expect(m).to.be.instanceof(Model);

        expect(m.primary).to.eql("entity_id");
        expect(m.tableName).to.eql("Person");
    });

    it("properties should not be modifiable", function() {
        m.tableName = "bob";
        expect(m.tableName).to.eql("Person");
    });

    it("should be extendable (new properties)", function() {
        m.source = "source";
        expect(m.source).to.eql("source");
    });

    it("fields should return a hashmap of field objects", function() {
        expect(typeof m.fields).to.eql("object");
        expect(m.fields["entity_id"]).to.be.instanceof(Field);
    });

    it("listFields() should return an array of Field instances", function() {
        expect(m.listFields()).to.be.array;

        m.listFields().forEach(function(f) {
            // is Field instance
            expect(f).to.be.instanceof(Field);

            // is own field/prop
            expect(schema["Person"].fields[f.name]).to.exist;
        });
    });
});
