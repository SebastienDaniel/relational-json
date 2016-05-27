var expect = require("chai").expect,
    Field = require("../../src/scripts/buildModel/Model/Field"),
    schema = require("../data/mixed-graph");

describe("Field", function() {
    it("should create a Field instance", function() {
        expect(new Field("id", schema["Entity"].fields.id)).to.be.instanceof(Field);
    });

    it("should contain props: \n\tname\n\tdataType\n\tallowNull", function() {
        var f = new Field("created_on", schema["ExternalEntity"].fields.created_on);
        
        expect(f).to.have.property("name");
        expect(f.name).to.eql("created_on");

        expect(f).to.have.property("dataType");
        expect(f.dataType).to.eql("datetime");

        expect(f).to.have.property("allowNull");
        expect(f.allowNull).to.eql(false);
    });

    it("should set a default value of 'null' when allowNull === true, but no defaultValue is provided", function() {
        var f = new Field("created_on", {
                "allowNull": false,
                "dataType": "datetime",
                "writable": true
            }),
            f2 = new Field("created_on", {
                "allowNull": true,
                "dataType": "datetime",
                "writable": true
            });

        expect(f.defaultValue).to.eql(undefined);
        expect(f2.defaultValue).to.eql(null);
    });

    it("should have Field.prototype methods", function() {
        var f = new Field("created_on", schema["ExternalEntity"].fields.created_on);

        expect(f.isRequired).to.be.instanceof(Function);
        expect(f.validateData).to.be.instanceof(Function);
    });
});

describe("Field.isRequired()", function() {
    it("should return true for required fields", function() {
        var f = new Field("created_on", {
                "allowNull": false,
                "dataType": "datetime",
                "writable": true
            }),
            f2 = new Field("created_on", {
                "allowNull": true,
                "dataType": "datetime",
                "writable": true
            }),
            f3 = new Field("created_on", {
                "allowNull": false,
                "defaultValue": "hello",
                "dataType": "datetime",
                "writable": true
            });

        expect(f.isRequired()).to.be.true;
    });

    it("should return false for unrequired fields", function() {
        var f = new Field("created_on", {
                "allowNull": false,
                "dataType": "datetime",
                "writable": true
            }),
            f2 = new Field("created_on", {
                "allowNull": true,
                "dataType": "datetime",
                "writable": true
            }),
            f3 = new Field("created_on", {
                "allowNull": false,
                "defaultValue": "hello",
                "dataType": "datetime",
                "writable": true
            });

        expect(f2.isRequired()).to.be.false;
        expect(f3.isRequired()).to.be.false;
    });
});
