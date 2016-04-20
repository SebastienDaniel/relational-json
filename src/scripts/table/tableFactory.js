var model = require("../model/modelFactory"),
    ImmDictionary = require("./ImmutableDictionary"),
    get = require("./get"),
    put = require("./put"),
    post = require("./post"),
    remove = require("./remove");

module.exports = function tableFactory(tn, fullModel, env) {
    "use strict";
    var context = Object.freeze({
        env: env, // settings of the relational-json instance
        model: model(tn, fullModel), // table's model instance
        rows: new ImmDictionary() // table's private data dictionary
    });

    return Object.freeze({
        get: function() {
            return get(arguments, context.rows);
        },
        post: function(d) {
            return post(context, d);
        },
        put: function(d, pkValue) {
            return put(context, pkValue, d)
        },
        delete: function(id) {
            return remove(context, id);
        },
        meta: context.model
    });
};
