let expect = require('chai').expect,
    rJSON = require('../../../src/index.js');

describe('table.post()', function() {
    let graph = require('../../data/no-relation-graph.json'),
        db = rJSON(graph),
        t1 = db['Person'];

    it('should allow data creation (post)', function() {
        const bob = t1.post({entity_id: 1, first_name: 'bob', last_name: 'builder', gender: 'm', created_on: '2015-01-01T00:00:00Z'});

        expect(bob).to.exist;
        expect(bob.entity_id).to.eql(1);
        expect(bob.first_name).to.eql('bob');
    });

    it('should throw on duplicate post', function() {
        expect(function() {
            return t1.post({id: 1, name: 'bobby', created_on: '2015-12-01T00:00:00Z'});
        }).to.throw(Error);
    });

    it('should break top-level referential equality', function() {
        let d = t1.get(),
            bob2;

        expect(d).to.equal(t1.get());

        bob2 = t1.post({entity_id: 2, first_name: 'bob2', last_name: 'builder', gender: 'm', created_on: '2015-01-01T00:00:00Z'});

        expect(t1.get()).to.not.equal(d);
        expect(t1.get()).to.equal(t1.get());
        expect(t1.get()).to.eql(t1.get());
    });
});

describe('table.post() - inheritance', function() {
    let graph = require('../../data/extension-graph.json'),
        db = rJSON(graph);

    it('should create parents (if non-existent) when creating a child', function() {
        const bob = db.Person.post({
            entity_id: 1,
            first_name: 'bob',
            last_name: 'builder',
            gender: 'm',
            created_on: '2015-01-01T00:00:00Z',
            created_by: 1
        });

        expect(db.Person.get(1)).to.exist;
        expect(db.Person.get(1).first_name).to.eql('bob');

        expect(db.ExternalEntity.get(1)).to.exist;
        expect(db.ExternalEntity.get(1).created_on).to.eql('2015-01-01T00:00:00Z');

        expect(db.Entity.get(1)).to.exist;
        expect(db.Entity.get(1).deleted).to.eql(0);
        expect(db.Entity.get(1).id).to.eql(1);
    });

    it('should allow progressive creation of children', function() {
        db.Entity.post({
            id: 2
        });
        expect(db.Entity.get(2)).to.exist;
        expect(db.Entity.get(2).deleted).to.eql(0);


        db.ExternalEntity.post({
            entity_id: 2,
            created_on: '2016-01-01T00:00:00Z',
            created_by: 1
        });
        expect(db.Entity.get(2)).to.exist;
        expect(db.Entity.get(2).deleted).to.eql(0);
        expect(db.ExternalEntity.get(2)).to.exist;
        expect(db.ExternalEntity.get(2).created_on).to.eql('2016-01-01T00:00:00Z');
        expect(db.ExternalEntity.get(2).deleted).to.eql(0);


        db.Person.post({
            entity_id: 2,
            first_name: 'mike',
            last_name: 'tike',
            gender: 'm'
        });
        expect(db.Entity.get(2)).to.exist;
        expect(db.Entity.get(2).deleted).to.eql(0);
        expect(db.ExternalEntity.get(2)).to.exist;
        expect(db.ExternalEntity.get(2).created_on).to.eql('2016-01-01T00:00:00Z');
        expect(db.ExternalEntity.get(2).deleted).to.eql(0);
        expect(db.Person.get(2)).to.exist;
        expect(db.Person.get(2).first_name).to.eql('mike');
        expect(db.Person.get(2).deleted).to.eql(0);
    });
});
