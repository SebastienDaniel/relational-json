const expect = require('chai').expect,
    schema = require('./data/mixed-graph.json'),
    rjson = require('../src/index.js');

describe('relational-json, immutability', function() {
    it('should provide immutability at the top level (data container)', function() {
        const db = rjson(schema);

        // create initial data
        db.Person.post({
            entity_id: 1,
            first_name: 'seb',
            last_name: 'dan',
            gender: 'm',
            created_on: '2016-01-01T12:00:00Z',
            created_by: 2
        });

        expect(db.Person.get()).to.eql(db.Person.get());
        expect(db.Person.get()).to.equal(db.Person.get());

        // store current value
        const mem = db.Person.get();

        // change the data
        db.Person.put({entity_id: 1, first_name: 'bob'});

        // test equalities
        expect(db.Person.get()).to.have.length(1);
        expect(db.Person.get()).to.not.equal(mem);
        expect(db.Person.get(1)).to.not.equal(mem[0]);
        expect(db.Person.get(1)).to.equal(db.Person.get()[0]);

        expect(db.Person.get(1).first_name).to.eql('bob');
        expect(mem[0].first_name).to.eql('seb');
    });

    it('should provide hierarchical immutability on PUT operations', function() {
        let db = rjson(schema),
            mems = {};

        // create initial data
        db.Person.post({
            entity_id: 1,
            first_name: 'seb',
            last_name: 'dan',
            gender: 'm',
            created_on: '2016-01-01T12:00:00Z',
            created_by: 2
        });

        mems.person = db.Person.get(1);

        // modify parent
        db.ExternalEntity.put({entity_id: 1, created_on: '2017-01-01T12:00:00Z'});

        expect(db.Person.get(1)).to.not.equal(mems.person);
        expect(db.Person.get(1).first_name).to.eql('seb');

        expect(db.ExternalEntity.get(1)).to.not.equal(mems.externalEntity);
        expect(db.ExternalEntity.get(1).created_on).to.eql('2017-01-01T12:00:00Z');

        mems.person = db.Person.get(1);
        mems.externalEntity = db.ExternalEntity.get(1);
        mems.entity = db.Entity.get(1);

        // modify furthest parent
        db.Entity.put({id: 1, deleted: 1});

        expect(db.Person.get(1)).to.not.equal(mems.person);
        expect(db.Person.get(1).first_name).to.eql('seb');

        expect(db.ExternalEntity.get(1)).to.not.equal(mems.externalEntity);
        expect(db.ExternalEntity.get(1).created_on).to.eql('2017-01-01T12:00:00Z');

        expect(db.Entity.get(1)).to.not.equal(mems.entity);
        expect(db.Entity.get(1).deleted).to.eql(1);
    });
});
