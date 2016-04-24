/**
 * @private
 * Uses schema "extends" information to add "extendedBy" information
 * which is needed by the Model parser
 * @param {object} schema
 */
module.exports = function addExtendedByData(schema) {
    var keys = Object.keys(schema);

    keys.forEach(function(key) {
        var ext = schema[key].extends;

        // scan each "extends" relation
        if (ext) {

            // find target table's extendedBy map or create it
            if (!schema[ext.table].extendedBy || typeof schema[ext.table].extendedBy !== "object") {
                schema[ext.table].extendedBy = {};
            }

            // inject extends relation, reversed
            schema[ext.table].extendedBy[key] = {
                localField: ext.foreignField,
                foreignField: ext.localField
            };
        }
    });

    return schema;
};
