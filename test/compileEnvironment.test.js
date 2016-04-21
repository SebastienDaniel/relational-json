var chai = require("chai"),
    expect = chai.expect,
    compileEnvironment = require("../src/scripts/compileEnvironment");

describe("compileEnvironment() object", function() {
    var opt = compileEnvironment({}),
        preproc = function(table, field, data) {
            return "stuff";
        },
        opt2 = compileEnvironment({
            preprocessor: preproc,
            db: "db"
        });

    it("should contain the db object, all the time", function() {
        expect(opt).to.have.property("db");
        expect(typeof opt.db).to.eql("object");

        expect(opt2).to.have.property("db");
        expect(typeof opt2.db).to.eql("object");
    });

    it("should contain a preprocessor function, if provided", function() {
        expect(opt).to.not.have.property("preprocessor");
        expect(opt2).to.have.property("preprocessor");
        expect(typeof opt2.preprocessor).to.eql("function");
        expect(opt2.preprocessor).to.eql(preproc);
    });

    it("should return a new object, distinct from the provided argument", function() {
        var arg = {},
            opt3 = compileEnvironment(arg);

        expect(opt3).to.not.eql(arg);
        expect(typeof opt3).to.eql("object");
    });
});
