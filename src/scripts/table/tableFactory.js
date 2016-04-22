var buildAliasMap = require("../model/buildAliasMap"),
    ImmDictionary = require("./Dictionary"),
    get = require("./get"),
    put = require("./put"),
    post = require("./post"),
    remove = require("./remove");

module.exports = function tableFactory(model, env) {
    "use strict";
    var context = Object.freeze({
        env: env, // settings of the relational-json instance
        model: model, // table's model instance
        rows: new ImmDictionary() // table's private data dictionary
    });

    return Object.freeze({
        get: function () {
            return get(arguments, context.rows);
        },
        post: function (d) {
            return post(context, d);
        },
        put: function (d, pkValue) {
            return put(context, pkValue, d)
        },
        delete: function (id) {
            return remove(context, id);
        },
        meta: Object.freeze(
            Object.create(null, {
                name: {
                    value: model.tableName,
                    enumerable: true
                },
                pk: {
                    value: model.primary,
                    enumerable: true
                },
                aliasMap: {
                    value: Object.freeze(buildAliasMap(model)),
                    enumerable: true
                },
                ownRequiredFields: {
                    value: model.getRequiredFields("own"),
                    enumerable: true
                },
                allRequiredFields: {
                    value: model.getRequiredFields("all"),
                    enumerable: true
                }
            })
        )
    });
};
