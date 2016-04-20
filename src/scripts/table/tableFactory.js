var model = require("../model/modelFactory"),
    ImmDictionary = require("./ImmutableDictionary"),
    remove = require("./remove"),
    get = require("./get"),
    put = require("./put"),
    post = require("./post");

module.exports = function tableFactory(tn, fullModel, env) {
    "use strict";
    var c = {
            env: env,
            model: model(tn, fullModel), // table's model instance
            rows: new ImmDictionary() // table's private data
        };

    return Object.freeze({
        get: function() {
            return get.apply(c.rows, arguments);
        },
        post: function(d) {
            return post(d, c);
        },
        put: function(d, pkValue) {
            return put(d, pkValue, c)
        },
        delete: function(id) {
            return remove(id, c);
        },
        meta: c.model
    });
};
