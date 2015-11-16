/**
 * scans the data array to determine
 * Identical to Array.find, just a more optimized version
 * @param {string} pkName - key name of the primary field
 * @param {number} pkValue - integer value to match
 * @param {Array} data - array to lookup
 * @returns {boolean}
 */
module.exports = function(pkName, pkValue, data) {
    var dL = data.length,
        i;

    for (i = 0; i < dL; i++) {
        if (data[i][pkName] === pkValue) {
            return true;
        }
    }

    return false;
};
