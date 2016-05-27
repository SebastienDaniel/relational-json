var verifyPrimaryField = require("./verifyTablePrimaryField"),
    verifyFields = require("./verifyTableFields"),
    verifyAggregates = require("./verifyAggregateRelations"),
    verifyExtends = require("./verifyExtendsRelations");

function scanSchemaTables(schema) {
    "use strict";
    return Object.keys(schema).every(function(key) {
        return verifyPrimaryField(schema, key) &&
               verifyFields(schema, key) &&
               verifyExtends(schema, key) &&
               verifyAggregates(schema, key);
    });
}

module.exports = scanSchemaTables;
