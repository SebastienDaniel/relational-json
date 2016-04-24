"use strict";

var buildAliasMap = require("../model/buildAliasMap"),
    ImmDictionary = require("./Dictionary"),
    get = require("./get"),
    put = require("./put"),
    post = require("./post"),
    remove = require("./remove");

/**
 * @typedef {object} Table
 * @summary Once relational-json parsed your schema, it will return your relational database, which will be a collection of all the Tables in your data.
 * Each Table uses an internal Dictionary to store, retrieve and manipulate it's data (rows).
 * Tables are essentially the interface through which you manipulate data.
 */

module.exports = function tableFactory(model, env) {
    var context = Object.freeze({
        env: env, // settings of the relational-json instance
        model: model, // table's model instance
        rows: new ImmDictionary() // table's private data dictionary
    });

    return Object.freeze({
        /**
         * @function
         * @name Table#get
         *
         * @summary returns row data matching the provided arguments on their primary field value
         * @params list of primary key values to return
         * @returns {object|object[]}
         * if no argument is provided, it returns an array of all data within the table.
         * if 1 argument is provided, it returns that row object
         * if many arguments are provided, it returns an array containing those row objects
         */
        get: function() {
            return get(arguments, context.rows);
        },

        /**
         * @function
         * @name Table#post
         *
         * @summary creates a new row of data
         * @param {object} d - data bundle, must contain all required fields
         * @returns {object} row instance created
         */
        post: function(d) {
            return post(context, d);
        },

        /**
         * @function
         * @name Table#put
         *
         * @summary modifies a data row, by re-creating the row merged with the new data
         * @param {object} d - field:value object of data to modify
         * @param {*} pkValue=d.primary - primary value to find row to modify
         * @returns {object} newly created row
         */
        put: function(d, pkValue) {
            return put(context, pkValue, d);
        },

        /**
         * @function
         * @name Table#delete
         *
         * @summary recursively deletes the target row and it's children (if any)
         * @param {*} id - primary field value of row to delete
         * @returns {object} deleted row
         */
        delete: function(id) {
            return remove(context, id);
        },

        /**
         * @name Table#meta
         *
         * @summary partial interface into the Table's inner details
         */
        meta: Object.freeze(
            Object.create(null, {
                /**
                 * @name Table#meta.name
                 * @type string
                 *
                 * @summary Table's property key in the relational-json database
                 */
                name: {
                    value: model.tableName,
                    enumerable: true
                },

                /**
                 * @name Table#meta.pk
                 * @type {string}
                 *
                 * @summary name of the Table's primary field
                 */
                pk: {
                    value: model.primary,
                    enumerable: true
                },

                /**
                 * @name Table#meta.primary
                 * @type {string}
                 *
                 * @summary alias of Table.meta.pk
                 */
                primary: {
                    value: model.primary
                },

                /**
                 * @name Table#meta.aliasMap
                 * @type object
                 *
                 * @summary hashmap of the the table's rows' properties pointing to other tables in the relational-json database
                 */
                aliasMap: {
                    value: Object.freeze(buildAliasMap(model)),
                    enumerable: true
                },

                /**
                 * @name Table#meta.ownRequiredFields
                 * @type {string[]}
                 *
                 * @summary list of all own required fields, which must have a value at all times
                 */
                ownRequiredFields: {
                    value: model.getRequiredFields("own"),
                    enumerable: true
                },

                /**
                 * @name Table#meta.allRequiredFields
                 * @type {string[]}
                 *
                 * @summary list of all required fields, including own & ancestors' required fields
                 */
                allRequiredFields: {
                    value: model.getRequiredFields("all"),
                    enumerable: true
                }
            })
        )
    });
};
