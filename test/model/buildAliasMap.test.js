let bam = require('../../src/buildModel/Model/buildAliasMap'),
    expect = require('chai').expect,
    compileModel = require('../../src/buildModel/'),
    graph = require('../data/mixed-graph.json'),
    addExtendedByData = require('../../src/buildModel/addExtendedByToSchema'),
    model = compileModel(addExtendedByData(graph));

describe('getAliasMap', function() {
    it('should have own aggregate relations', function() {
        expect(bam(model['Organization']).Organizations).to.eql('Organization');
        expect(bam(model['Organization']).Persons).to.eql('Person');
        expect(bam(model['Organization']).RefIndustry).to.eql('RefIndustry');
    });

    it('should contain all aggregate relations in the inheritance chain', function() {
        expect(bam(model['Entity'])).to.eql({
            'ExternalLinks': 'ExternalLink',
            'ContactValues': 'ContactValue',
            'ExternalEntity': 'ExternalEntity'
        });

        expect(bam(model['ExternalEntity'])).to.eql({
            'ExternalLinks': 'ExternalLink',
            'ContactValues': 'ContactValue',
            'Person': 'Person',
            'Entity': 'Entity',
            'Organization': 'Organization'
        });

        expect(bam(model['Organization'])).to.eql({
            'ExternalLinks': 'ExternalLink',
            'ContactValues': 'ContactValue',
            'ExternalEntity': 'ExternalEntity',
            'Persons': 'Person',
            'ParentOrganization': 'Organization',
            'RefIndustry': 'RefIndustry',
            'Organizations': 'Organization'
        });
    });

    it('should not have the distant ancestor relation', function() {
        expect(bam(model['Organization'])).to.not.have.property('Entity');
    });
});
