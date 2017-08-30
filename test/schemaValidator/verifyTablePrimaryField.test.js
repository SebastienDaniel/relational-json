let expect = require('chai').expect,
    verify = require('../../src/schemaValidator/verifyTablePrimaryField');

describe('schemaValidator.verifyTablePrimaryField', function() {
    it('should flag tables missing the primary property with a SyntaxError', function() {
        const schema = {
            myTable: {
                fields: {
                    name: { dataType: 'string' }
                }
            }
        };

        expect(function() {
            return verify(schema, 'myTable');
        }).to.throw(SyntaxError);
    });

    it("should flag tables that don't have their primary key in their fields object with a ReferenceError", function() {
        const schema = {
            myTable: {
                primary: 'id',
                fields: {
                    name: { dataType: 'string' }
                }
            }
        };

        expect(function() {
            return verify(schema, 'myTable');
        }).to.throw(ReferenceError);
    });

    it("should return 'true' if the primary key setup is valid", function() {
        const schema = {
            myTable: {
                primary: 'id',
                fields: {
                    id: { dataType: 'integer' },
                    name: { dataType: 'string' }
                }
            }
        };

        expect(verify(schema, 'myTable')).to.eql(true);
    });
});
