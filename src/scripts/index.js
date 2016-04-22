var buildDatabase = require("./buildDatabase"),
    compileEnvironment = require("./compileEnvironment"),
    //validateSchema = require("./validateSchema"),
    buildModelGraph = require("./model/buildModelGraph");

module.exports = function(schema, options) {
    return buildDatabase(
        buildModelGraph(
            //validateSchema(schema)
            schema
        ),
        compileEnvironment(options)
    );
};

