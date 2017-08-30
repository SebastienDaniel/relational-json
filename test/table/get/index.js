let expect = require('chai').expect,
    graph = require('../../data/no-relation-graph.json'),
    rJSON = require('../../../src/index.js');

describe('table.get()', function() {
    let db = rJSON(graph),
        t1 = db['Person'];

    const bob = t1.post({entity_id: 1, first_name: 'bob', last_name: 'builder', gender: 'm', created_on: '2015-01-01T00:00:00Z'});

    it('should allow data retrieval (get)', function() {
        // get instance
        expect(t1.get(1)).to.eql({
            entity_id: 1,
            first_name: 'bob',
            last_name: 'builder',
            gender: 'm',
            job_title: null,
            birthdate: null
        });
        expect(t1.get(1).first_name).to.eql('bob');

        // get all data
        expect(t1.get()).to.have.length(1);
        expect(t1.get()[0].first_name).to.eql('bob');
    });
    it('should retrieve all data when get is called without argument', function() {
        expect(t1.get()).to.be.instanceof(Array);
    });
    it('should allow retrieving multiple specific values', function() {
        t1.post({entity_id: 2, first_name: 'seb', last_name: 'dan', gender: 'm', created_on: '2015-01-01T00:00:00Z'});
        t1.post({entity_id: 3, first_name: 'vegas', last_name: 'the cat', gender: 'm', created_on: '2015-01-01T00:00:00Z'});

        expect(t1.get(1, 2)).to.be.instanceof(Array);
        expect(t1.get(1, 3)[0].first_name).to.eql('bob');
        expect(t1.get(1, 3)[1].first_name).to.eql('vegas');
    });
    it('should prevent data tampering, even when getting all', function() {
        t1.get(1).first_name = 'mike';
        expect(t1.get(1).first_name).to.eql('bob');

        t1.get().splice(0, 1);
        expect(t1.get()).to.have.length(2);
    });

    it('should be referentially stable', function() {
        expect(t1.get()).to.equal(t1.get());
    });
});
