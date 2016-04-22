var expect = require("chai").expect,
    aggregateSchema = require("../data/aggregation-graph.json"),
    flatSchema = require("../data/no-relation-graph.json"),
    extensionSchema = require("../data/extension-graph.json"),
    addRelations = require("../../src/scripts/model/addRelations"),
    Model = require("../../src/scripts/model/Model"),
    buildModelGraph = require("../../src/scripts/model/buildModelGraph");

describe("addRelations()", function() {
    var flatModel = buildModelGraph(flatSchema),
        extensionModel = buildModelGraph(extensionSchema),
        aggregateModel = buildModelGraph(aggregateSchema);

    it("should not change Model instances if they have no relations", function() {
        Object.keys(flatModel).forEach(function(key) {
            expect(flatModel[key].extends).to.not.exist;
            expect(flatModel[key].extendedBy).to.not.exist;
            expect(flatModel[key].aggregates).to.not.exist;
        });
    });

    it("should add immediate parent and child relations, if present", function() {
        expect(extensionModel["ExternalEntity"]).to.exist;
        expect(extensionModel["ExternalEntity"].extendedBy).to.exist;
        expect(extensionModel["ExternalEntity"].extendedBy).to.be.instanceof(Array);
        expect(extensionModel["ExternalEntity"].extendedBy.length).to.eql(2);

        expect(extensionModel["ExternalEntity"].extends).to.exist;
        expect(extensionModel["ExternalEntity"].extends.table).to.be.instanceof(Model);
        expect(extensionModel["ExternalEntity"].extends.table.tableName).to.eql("Entity");

        expect(extensionModel["ExternalEntity"].aggregates).to.not.exist;

        expect(extensionModel["Entity"].extendedBy).to.exist;
        extensionModel["Entity"].extendedBy.forEach(function(ext) {
            expect(ext.table).to.be.instanceof(Model);
        });
    });

    it("should add aggregate relations, if present", function() {
        expect(aggregateModel["Entity"]).to.exist;
        expect(aggregateModel["Entity"].aggregates).to.exist;
        expect(aggregateModel["Entity"].aggregates).to.be.instanceof(Array);

        aggregateModel["Entity"].aggregates.forEach(function(agg) {
            expect(agg.table).to.be.instanceof(Model);
            expect(agg.table.tableName).to.exist;
        });
    });
});