let expect = require('chai').expect,
    aggregateSchema = require('../data/aggregation-graph.json'),
    flatSchema = require('../data/no-relation-graph.json'),
    extensionSchema = require('../data/extension-graph.json'),
    addRelations = require('../../src/buildModel/addRelationsToModel'),
    Model = require('../../src/buildModel/Model'),
    addExtendedByData = require('../../src/buildModel/addExtendedByToSchema'),
    buildModelGraph = require('../../src/buildModel');

describe('addRelations()', function() {
    it('should not change Model instances if they have no relations', function() {
        const flatModel = buildModelGraph(addExtendedByData(flatSchema));

        Object.keys(flatModel).forEach(function(key) {
            expect(flatModel[key].extends).to.not.exist;
            expect(flatModel[key].extendedBy).to.not.exist;
            expect(flatModel[key].aggregates).to.not.exist;
        });
    });

    it('should add immediate parent and child relations, if present', function() {
        const extensionModel = buildModelGraph(addExtendedByData(extensionSchema));
        expect(extensionModel['ExternalEntity'].extendedBy.length).to.eql(2);

        expect(extensionModel['ExternalEntity'].extends.model).to.be.instanceof(Model);
        expect(extensionModel['ExternalEntity'].extends.model.tableName).to.eql('Entity');

        expect(extensionModel['ExternalEntity'].aggregates).to.not.exist;

        extensionModel['Entity'].extendedBy.forEach(function(ext) {
            expect(ext.model).to.be.instanceof(Model);
        });
    });

    it('should add aggregate relations, if present', function() {
        const aggregateModel = buildModelGraph(addExtendedByData(aggregateSchema));

        aggregateModel['Entity'].aggregates.forEach(function(agg) {
            expect(agg.model).to.be.instanceof(Model);
            expect(agg.model.tableName).to.exist;
        });
    });
});
