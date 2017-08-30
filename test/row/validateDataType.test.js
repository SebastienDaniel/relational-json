let vdt = require('../../src/buildModel/Model/validateDataType'),
    chai = require('chai'),
    expect = require('chai').expect,
    graph = require('../data/types-graph.json');

describe('validateDataType', function() {
    it('should validate integers', function() {
        expect(vdt(graph.Person.fields.entity_id, 1)).to.be.true;
        expect(vdt(graph.Person.fields.entity_id, '1')).to.be.false;
        expect(vdt(graph.Person.fields.entity_id, 1.01)).to.be.false;
    });

    it('should validate floats', function() {
        expect(vdt(graph.Person.fields.hourly_wage, 1)).to.be.true;
        expect(vdt(graph.Person.fields.hourly_wage, '1')).to.be.false;
        expect(vdt(graph.Person.fields.hourly_wage, 1.01)).to.be.true;
    });

    it('should validate date', function() {
        expect(vdt(graph.Person.fields.birthdate, '2015')).to.be.true;
        expect(vdt(graph.Person.fields.birthdate, '2015-01')).to.be.true;
        expect(vdt(graph.Person.fields.birthdate, '2015-13')).to.be.false;
        expect(vdt(graph.Person.fields.birthdate, '0000-00-32')).to.be.false;
        expect(vdt(graph.Person.fields.birthdate, '2015-01-01')).to.be.true;
    });

    it('should validate time (MySQL format)', function() {
        expect(vdt(graph.Person.fields.start_time, '12:00')).to.be.false;
        expect(vdt(graph.Person.fields.start_time, '12')).to.be.false;
        expect(vdt(graph.Person.fields.start_time, '1200')).to.be.false;
        expect(vdt(graph.Person.fields.start_time, '12:00:01')).to.be.true;
        expect(vdt(graph.Person.fields.start_time, '120001')).to.be.false;
        expect(vdt(graph.Person.fields.start_time, '12:00:00.123456')).to.be.true;
    });

    it('should validate datetime', function() {
        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:00:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:00:60')).to.be.false;
        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:61:00')).to.be.false;
        expect(vdt(graph.Person.fields.hired, '2015-01-01T25:00:00')).to.be.false;
        expect(vdt(graph.Person.fields.hired, '2015-01-01 12:00:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-12-20')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01 12:00:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01-01 12:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015 12:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015')).to.be.true;

        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:00:00Z')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:00:00+04:00')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-12-20')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01T12:00:00Z')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015-01-01T12:00Z')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015T12:00Z')).to.be.true;
        expect(vdt(graph.Person.fields.hired, '2015')).to.be.true;
    });
});
