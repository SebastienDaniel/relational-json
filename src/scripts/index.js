"use strict";

var buildDatabase = require("./buildDatabase"),
    compileEnvironment = require("./compileEnvironment"),
    //validateSchema = require("./validateSchema"),
    addExtendedByData = require("./addExtendedByData"),
    buildModelGraph = require("./model/buildModelGraph");

module.exports = function(schema, options) {
    schema = addExtendedByData(schema);

    return buildDatabase(
        buildModelGraph(
            //validateSchema(schema)
            schema
        ),
        compileEnvironment(options)
    );
};

