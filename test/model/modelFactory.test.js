var expect = require("chai").expect,
    schema = require("../data/mixed-graph.json"),
    Field = require("../../src/scripts/model/Field"),
    modelFactory = require("../../src/scripts/model/modelFactory");

describe("modelFactory()", function() {
    var m = modelFactory("Person", schema["Person"]);

    it("should generate a model object", function() {
        expect(typeof m).to.eql("object");

        expect(m.primary).to.eql("entity_id");
        expect(m.tableName).to.eql("Person");
        expect(typeof m.getField).to.eql("function");

        expect(m.getField("first_name")).to.have.all.keys("name", "dataType", "allowNull");
    });

    it("properties should not be modifiable", function() {
        m.tableName = "bob";
        expect(m.tableName).to.eql("Person");

        m.getField = "field";
        expect(typeof m.getField).to.eql("function");
    });

    it("should be extendable (new properties)", function() {
        m.source = "source";
        expect(m.source).to.eql("source");
    });

    it("model.fields should return an array of Field instances", function() {
        expect(m.fields).to.be.array;

        m.fields.forEach(function(f) {
            // is Field instance
            expect(f).to.be.instanceof(Field);

            // is own field/prop
            expect(schema["Person"].fields[f.name]).to.exist;
        });
    });
});
