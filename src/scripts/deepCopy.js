/**
 * copies a given object primitive value by primitive value
 * effectively creating a copy and not a reference.
 * @param {object|Array} o - object or array to copy
 * @returns {object|Array}
 */
module.exports = function deepCopy(o) {
    var newO,
        i;

    if (typeof o !== "object" || !o) {
        return o;
    } else if (Object.prototype.toString.apply(o) === "[object Array]") {
        newO = [];
        for (i = 0; i < o.length; i += 1) {
            newO[i] = deepCopy(o[i]);
        }
        return newO;
    } else {
        newO = {};
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                newO[i] = deepCopy(o[i]);
            }
        }
        return newO;
    }
};
