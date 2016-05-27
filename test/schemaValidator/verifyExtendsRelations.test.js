var expect = require("chai").expect,
    verify = require("../../src/scripts/schemaValidator/verifyExtendsRelations");

describe("schemaValidator.verifyExtendsRelations", function() {
    it("should throw ReferenceError when extends.table cannot be found", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            },
            table2: {
                primary: "id",
                fields: {
                    id: "integer",
                    table1_id: "integer"
                },
                extends: {
                    table: "table3",
                    localField: "table1_id",
                    foreignField: "id"
                }
            }
        };

        expect(function() {
            return verify(schema, "table2");
        }).to.throw(ReferenceError);
    });

    it("should throw ReferenceError when extends.foreignField cannot be found on foreign table", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            },
            table2: {
                primary: "id",
                fields: {
                    id: "integer",
                    table1_id: "integer"
                },
                extends: {
                    table: "table1",
                    localField: "table1_id",
                    foreignField: "bad_id"
                }
            }
        };

        expect(function() {
            return verify(schema, "table2");
        }).to.throw(ReferenceError);
    });

    it("should throw ReferenceError when extends.localField cannot be found on local table", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            },
            table2: {
                primary: "id",
                fields: {
                    id: "integer",
                    table1_id: "integer"
                },
                extends: {
                    table: "table1",
                    localField: "bad_table1_id",
                    foreignField: "id"
                }
            }
        };

        expect(function() {
            return verify(schema, "table2");
        }).to.throw(ReferenceError);
    });

    it("should throw if localField dataType !== foreignField dataType", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            },
            table2: {
                primary: "id",
                fields: {
                    id: "integer",
                    table1_id: "string"
                },
                extends: {
                    table: "table1",
                    localField: "table1_id",
                    foreignField: "id"
                }
            }
        };

        expect(function() {
            return verify(schema, "table2");
        }).to.throw(TypeError);
    });

    it("should return true if all is good", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            },
            table2: {
                primary: "id",
                fields: {
                    id: "integer",
                    table1_id: "integer"
                },
                extends: {
                    table: "table1",
                    localField: "table1_id",
                    foreignField: "id"
                }
            }
        };

        expect(verify(schema, "table2")).to.eql(true);
    });

    it("should return true if table does not have an extends relation", function() {
        var schema = {
            table1: {
                primary: "id",
                fields: {
                    id: "integer"
                }
            }
        };

        expect(verify(schema, "table1")).to.eql(true);
    });
});