let expect = require('chai').expect,
    verify = require('../../src/schemaValidator/verifyAggregateRelations');

describe('schemaValidator.verifyAggregateRelations', function() {
    it('should throw ReferenceError when foreign table cannot be found', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer'
                },
                aggregates: [{
                    table: 'table3',
                    localField: 'table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(ReferenceError);
    });

    it('should throw ReferenceError when foreignField cannot be found on foreign table', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'bad_id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(ReferenceError);
    });

    it('should throw ReferenceError when localField cannot be found on local table', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer'
                },
                aggregates: [{
                    table: 'table3',
                    localField: 'bad_table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(ReferenceError);
    });

    it('should throw TypeError if localField dataType !== foreignField dataType', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'string'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(TypeError);
    });

    it('should throw TypeError if cardinality is missing or of invalid value', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'id',
                    alias: 'Threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(TypeError);

        schema.table2.aggregates[0].cardinality = 'multiple';
        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(TypeError);

        schema.table2.aggregates[0].cardinality = 'many';
        expect(verify(schema, 'table2')).to.eql(true);

        schema.table2.aggregates[0].cardinality = 'single';
        expect(verify(schema, 'table2')).to.eql(true);
    });

    it('should throw Error if alias conflicts with local field names', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer',
                    threes: 'string'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'threes'
                }]
            }
        };

        expect(function() {
            return verify(schema, 'table2');
        }).to.throw(Error);
    });

    it('should return true if all is good', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'integer'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(verify(schema, 'table2')).to.eql(true);
    });

    it('should return true if table does not have aggregate relations', function() {
        const schema = {
            table1: {
                primary: 'id',
                fields: {
                    id: 'integer'
                }
            },
            table2: {
                primary: 'id',
                fields: {
                    id: 'integer',
                    table1_id: 'string'
                },
                aggregates: [{
                    table: 'table1',
                    localField: 'table1_id',
                    foreignField: 'id',
                    cardinality: 'many',
                    alias: 'Threes'
                }]
            }
        };

        expect(verify(schema, 'table1')).to.eql(true);
    });
});
