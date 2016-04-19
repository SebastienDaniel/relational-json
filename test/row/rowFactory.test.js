var chai = require("chai"),
    expect = chai.expect,
    rf = require("../../src/scripts/row/rowFactory");

describe("rowFactory()", function() {
    var model = {
            Table1: {
                primary: "id",
                fields: {
                    id: {
                        dataType: "integer",
                        allowNull: false,
                        writable: false
                    },
                    name: {
                        dataType: "string",
                        allowNull: false,
                        writable: true
                    },
                    created_on: {
                        dataType: "datetime",
                        allowNull: false,
                        writable: false
                    }
                },
                extendedBy: []
            }
        },
        data = {id: 1, name: "bob", created_on: "2015-01-01T00:00:00Z"},
        row = rf(model.Table1, data, {});

    it("should create a row object", function() {
        expect(row).to.exist;
        expect(row.name).to.eql("bob");
        expect(row.id).to.eql(1);
    });

    it("should prevent tampering with row values", function() {
        row.blah = "blah";
        expect(row.blah).to.be.undefined;

        row.name = "mike";
        expect(row.name).to.eql("bob");

        data.id = 2;
        expect(row.id).to.eql(1);
    });
});
