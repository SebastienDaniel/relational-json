var expect = require("chai").expect,
    verify = require("../../src/scripts/schemaValidator/verifyTableFields");

describe("schemaValidator.verifyTableFields", function() {
    it("should throw a SyntaxError for tables without fields", function() {
        var schema = {
            myTable: {
                primary: "id"
            }
        };

        expect(function() {
            return verify(schema, "myTable");
        }).to.throw(SyntaxError);
    });

    it("should throw TypeError for fields that don't have a proper dataType", function() {
        var schema = {
            myTable: {
                primary: "id",
                fields: {
                    id: {
                        dataType: "double"
                    },
                    name: {
                        dataType: "string"
                    }
                }
            }
        };

        expect(function() {
            return verify(schema, "myTable");
        }).to.throw(TypeError);

        // should also throw when in shorthand
        schema.fields = {
            id: "double",
            name: "string"
        };

        expect(function() {
            return verify(schema, "myTable");
        }).to.throw(TypeError);
    });

    it("should allow shorthand field descriptors", function() {
        var schema = {
            myTable: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            }
        };

        expect(verify(schema, "myTable")).to.eql(true);
    });

    it("should return true on valid fields", function() {
        var schema = {
            myTable: {
                primary: "id",
                fields: {
                    id: "integer",
                    name: "string",
                    birth_date: {
                        dataType: "date",
                        allowNull: true
                    }
                }
            }
        };

        expect(verify(schema, "myTable")).to.eql(true);
    });
});