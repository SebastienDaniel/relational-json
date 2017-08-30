let expect = require('chai').expect,
    model = require('../../../src/buildModel'),
    schema = require('../../data/extension-graph.json'),
    rJSON = require('../../../src/index.js'),
    getChild = require('../../../src/table/utils/getFurthestChild');

describe('table.put.getFurthestChild', function() {
    it('should always return the furthest child of a row, otherwise itself', function() {
        let db = rJSON(schema),
            m = model(schema);

        // create entry
        db.Person.post({
            entity_id: 1,
            first_name: 'seb',
            last_name: 'dan',
            gender: 'm',
            created_on: '2015-01-01T12:00:00Z',
            created_by: 1
        });

        db.Person.post({
            entity_id: 2,
            first_name: 'key',
            last_name: 'tay',
            gender: 'f',
            created_on: '2016-01-01T12:00:00Z',
            created_by: 1
        });

        // basic tests to make sure we have proper structure
        expect(db.Entity.get(1)).to.exist;
        expect(db.Entity.get(1).deleted).to.eql(0);
        expect(db.ExternalEntity.get(1).created_on).to.eql('2015-01-01T12:00:00Z');
        expect(db.Person.get(1).first_name).to.eql('seb');

        // start proper tests
        expect(getChild(m.Person, db, db.Person.get(1)).row).to.equal(db.Person.get(1));
        expect(getChild(m.ExternalEntity, db, db.ExternalEntity.get(1)).row).to.equal(db.Person.get(1));
        expect(getChild(m.Entity, db, db.Entity.get(1)).row).to.equal(db.Person.get(1));

        expect(getChild(m.Person, db, db.Person.get(2)).row).to.equal(db.Person.get(2));
        expect(getChild(m.ExternalEntity, db, db.ExternalEntity.get(2)).row).to.equal(db.Person.get(2));
        expect(getChild(m.Entity, db, db.Entity.get(2)).row).to.equal(db.Person.get(2));
    });
});
