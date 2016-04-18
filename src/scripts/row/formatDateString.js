/**
 * adds a tolerance level for datetime string formats, which can have a missing "T" or "timezone offset"
 * Expects that the string has been pre-validated (validateDataType)
 * @param str
 * @returns {string} - properly formatted javascript datetime string
 */
module.exports = function formatDateString(str) {
    "use strict";
    var d = Date.parse(str);

    if (isNaN(d)) {
        // add a tolerance level
        // add the time "T"
        if (/^\d{4}(?:-?\d{2}){2} \d/.test(str)) {
            str = str.replace(" ", "T");

            // try parsing again
            d = Date.parse(str);
        }
    }

    if (!isNaN(d)) {
        // return ISO date string, without millisecond precision
        return new Date(d).toISOString().replace(/\.\d*/, "");
    } else {
        throw SyntaxError("relational-json.formatDateString() expects a date string argument. Provided\n" + str + " (" + typeof str + ")\nnot a valid date string");
    }
};
