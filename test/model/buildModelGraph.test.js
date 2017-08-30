let expect = require('chai').expect,
    schema = require('../data/mixed-graph.json'),
    Model = require('../../src/buildModel/Model'),
    addExtendedByData = require('../../src/buildModel/addExtendedByToSchema'),
    buildModelGraph = require('../../src/buildModel');

describe('buildModelGraph()', function() {
    const m = buildModelGraph(addExtendedByData(schema));

    it('should create a model object for each schema key', function() {
        Object.keys(m).forEach(function(key) {
            expect(schema[key]).to.exist;
            expect(m[key]).to.be.instanceof(Model);
        });
    });

    it('should have added relations to Models', function() {
        Object.keys(m).forEach(function(key) {
            if (schema[key].extends) {
                expect(m[key].extends.model).to.be.instanceof(Model);
            }

            if (schema[key].aggregates) {
                m[key].aggregates.forEach(function(agg) {
                    if (agg.model === undefined) {
                        console.log(agg);
                    }
                    expect(agg.model).to.be.instanceof(Model);
                });
            }

            if (schema[key].extendedBy) {
                m[key].extendedBy.forEach(function(ext) {
                    expect(ext.model).to.be.instanceof(Model);
                });
            }
        });
    });
});
