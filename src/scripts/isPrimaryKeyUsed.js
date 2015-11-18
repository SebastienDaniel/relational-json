/**
 * scans the data array to determine
 * Identical to Array.find, just a more optimized version
 * @param {string} [pkName="id"] - key name of the primary field
 * @param {number} pkValue - integer value to match
 * @param {Array} data - array to lookup
 * @returns {boolean}
 */
module.exports = function(data, pkValue, pkName) {
    "use strict";
    var dL = data.length,
        i;

    if (!pkValue) {
        throw Error("Searching for a used PK with invalid value: " + pkValue + "\n" + pkName + "\n" + data);
    }
    pkName = pkName || "id";

    for (i = 0; i < dL; i++) {
        if (data[i][pkName] === pkValue) {
            return true;
        }
    }

    return false;
};
