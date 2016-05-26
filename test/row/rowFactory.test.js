var chai = require("chai"),
    expect = chai.expect,
    mixedSchema = require("../data/mixed-graph.json"),
    compileModel = require("../../src/scripts/buildModel"),
    rf = require("../../src/scripts/row/rowFactory"),
    fullApp = require("../../src/scripts/index.js");

describe("rowFactory()", function() {
    var model = compileModel({
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
        }),
        data = {id: 1, name: "bob", created_on: "2015-01-01T00:00:00Z"},
        row = rf(model.Table1, {}, data);

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

    it("should have a dynamic link to other rows in other tables", function() {
        var app = fullApp(mixedSchema),
            model = compileModel(mixedSchema),
            data = {
                person: {
                    entity_id: 1,
                    first_name: "seb",
                    last_name: "dan",
                    gender: "male",
                    created_on: "2015-01-01T00:00:00Z",
                    created_by: 2
                },
                contact_method: {
                    id: 1,
                    name: "email",
                    key: "email"
                },
                contact_value: {
                    id: 1,
                    created_on: "2015-01-01T00:00:00Z",
                    created_by: 2,
                    entity_id: 1,
                    value: "email@sebdan.com",
                    contact_method_id: 1
                }
            },
            method = app.RefContactMethod.post(data["contact_method"]),
            contact = app.ContactValue.post(data["contact_value"]);

        expect(contact.RefContactMethod).to.be.equal(method);
        expect(method.ContactValues).to.contain(contact);
    });
});
