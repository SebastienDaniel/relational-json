/**
 * adds a tolerance level for datetime string formats, which can have a missing "T" or "timezone offset"
 * Expects that the string has been pre-validated (validateDataType)
 * @param str
 * @returns {string} - properly formatted javascript datetime string
 */
module.exports = function(str) {
    "use strict";

    // add the time "T"
    if (/\d \d/.test(str)) {
        str = str.replace(" ", "T");
    }

    // assume UTC if no timezone
    if (/T/.test(str) && !/(Z|\-\d\d:|\+){1}/.test(str)) {
        str += "Z";
    }

    return str;
};
