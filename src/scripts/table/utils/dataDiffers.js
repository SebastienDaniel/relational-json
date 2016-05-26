/**
 * @private
 * @summary assumes that ALL possible fields are ALWAYS present on a row
 * scans based on current row, to find applicable keys
 * @param c
 * @param oldO
 * @param newO
 * @returns {boolean}
 */
function dataDiffers(oldO, newO) {
    "use strict";
    return Object.keys(oldO).some(function(key) {
        if (oldO[key] !== undefined && typeof oldO[key] !== "object") {
            return oldO[key] !== newO[key];
        }
    });
}

module.exports = dataDiffers;
