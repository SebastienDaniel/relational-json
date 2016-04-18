var getInheritanceChain = require("./getInheritanceChain");

/**
 * The alias map is a alias:tableName hash-map, where
 * a given alias, in the context of the current table,
 * points to another table in the schema
 * In other words, it is a map for nested data (Object or Array)
 */
module.exports = function(tn, fullModel) {
    "use strict";
    var aliases = getInheritanceChain(tn, fullModel).reduce(function(pV, cV) {
            if (fullModel[cV].aggregates) {
                return pV.concat(fullModel[cV].aggregates);
            } else {
                return pV;
            }
        }, []).reduce(function(pV, cV) {
            pV[cV.alias] = cV.foreignTable;
            return pV;
        }, {}),
        m = fullModel[tn];

    if (m.extendedBy) {
        m.extendedBy.reduce(function(pV, cV) {
            pV[cV.foreignTable] = cV.foreignTable;
            return pV;
        }, aliases);
    }

    return aliases;
};
