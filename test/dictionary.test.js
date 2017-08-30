const expect = require('chai').expect;
const Dictionary = require('../src/dataStructures/dictionary');

describe('Dictionary', function() {
    const d = new Dictionary();

    it("should tolerate missing 'new' operator", function() {
        expect(Dictionary()).to.be.instanceof(Dictionary);
        expect(new Dictionary()).to.be.instanceof(Dictionary);
    });

    describe('#set()', function() {
        it('should return dictionary instance', function() {
            const b = d.set('val1', 1);

            expect(b).to.equal(d);
            expect(b).to.be.instanceof(Dictionary);
        });

        it('should create unique entries only', function() {
            expect(function() {
                return d.set('val2', 2);
            }).to.not.throw;
        });

        it('should accept two arguments (key, value)', function() {
            const b = d.set(null, 3);

            expect(b).to.be.instanceof(Dictionary);
            expect(b).to.equal(d);
            expect(d._data['null']).to.eql(3);
        });

        it('should accept monadic form ({key:value})', function() {
            const b = d.set({val4: 4});

            expect(b).to.be.instanceof(Dictionary);
            expect(b).to.equal(d);
            expect(d._data['val4']).to.eql(4);
        });

        it('should update existing entries', function() {
            expect(d.set('val4', 5)).to.be.instanceof(Dictionary);
            expect(d.set('val4', 5)).to.equal(d);
            expect(d._data['val4']).to.eql(5);
        });

        it('should accept two arguments (key, value)', function() {
            expect(d.set('val4', 6)).to.be.instanceof(Dictionary);
            expect(d.set('val4', 6)).to.equal(d);
            expect(d._data['val4']).to.eql(6);
        });

        it('should accept monadic form ({key:value})', function() {
            expect(d.set({'val4': 7})).to.be.instanceof(Dictionary);
            expect(d.set({'val4': 7})).to.equal(d);
            expect(d._data['val4']).to.eql(7);
        });
    });

    describe('#get()', function() {
        it('should return existing values', function() {
            expect(d.get('val4')).to.eql(7);
        });

        it('should return undefined when no key is found', function() {
            expect(d.get('non-existant')).to.eql(undefined);
        });

        it('should return undefined when no key argument is provided', function() {
            expect(d.get()).to.eql(undefined);
        });
    });

    describe('#remove()', function() {
        it('should remove an existing entry', function() {
            d.set('val-to-die', 'bye bye');
            expect(d.hasKey('val-to-die')).to.be.true;
            expect(d.get('val-to-die')).to.eql('bye bye');

            d.remove('val-to-die');
            expect(d.hasKey('val-to-die')).to.be.false;
            expect(d.get('val-to-die')).to.eql(undefined);
        });

        it('should return the Dictionary instance', function() {
            expect(d.remove('val-to-die')).to.equal(d);
        });
    });

    describe('#hasKey()', function() {
        it('should confirm/infirm existence of entries', function() {
            expect(d.hasKey('val4')).to.be.true;
            expect(d.hasKey('non-existant')).to.be.false;
        });
    });

    describe('#hasValue()', function() {
        it('should confirm/infirm existence of entries', function() {
            d.set('val4', 44);
            expect(d.hasValue(44)).to.be.true;
            expect(d.hasValue('non-existant')).to.be.false;
        });
    });

    describe('#getValues()', function() {
        const d = new Dictionary();

        [1, 2, 'three', undefined, null].forEach(function(val) {
            d.set(val, val);
        });

        it('should return an array of all values in the dictionary', function() {
            expect(d.getValues().length).to.eql(5);
            expect(d.getValues()).to.include.members([1, 2, 'three', undefined, null]);
        });
    });

    describe('#getKeys()', function() {
        it('should return an array of keys in the dictionary', function() {
            const d = new Dictionary();

            [1, 2, 'three', undefined, null].forEach(function(val) {
                d.set(val, val);
            });

            it('should return an array of all values in the dictionary', function() {
                expect(d.getKeys().length).to.eql(5);
                expect(d.getKeys()).to.include.members(['1', '2', 'three', 'undefined', 'null']);
            });
        });
    });

    describe('#clear()', function() {
        it("should reset a dictionary's internal data to an empty object", function() {
            expect(Object.keys(d._data)).to.have.length.above(0);
            d.clear();
            expect(Object.keys(d._data)).to.have.length(0);
        });

        it('should return dictionary instance', function() {
            expect(d.clear()).to.be.instanceof(Dictionary);
            expect(d.clear()).to.equal(d);
        });
    });

    describe('#isEmpty()', function() {
        it('should confirm if Dictionary contains any keys', function() {
            const dd = Dictionary();
            expect(dd.isEmpty()).to.be.true;

            dd.set('key', 'value');
            expect(dd.isEmpty()).to.be.false;
        });
    });
});
