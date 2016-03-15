"use strict";

var getInheritanceChain = require("./getInheritanceChain");

/**
 * return a alias:tableName map of aggregate relations
 */
module.exports = function(tn, fullModel) {
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
