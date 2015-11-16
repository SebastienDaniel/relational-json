/**
 * Essentially an array.find() equivalent, but with a fallback to return all data
 * if no id is provided. It also only gets data based on primary-key matching
 * @param {string|number} [id] - primary key value to find
 * @param {string} [pk="id"] - primary key field
 * @param {Array} data - array of data to search
 * @returns {object|Array}
 */
// TODO: if data is ALWAYS sorted by ID (done at POST), we can make certain assumptions and increase lookup-speed on large arrays
module.exports = function getData(data, id, pk) {
    var o,
        i = 0,
        dL;

    // pk should default to "id"
    pk = pk || "id";

    if (id) { // return specific data object
        dL = data.length;
        while (i < dL) {
            if (data[i][pk] === id) {
                o = data[i];
                i = dL;
            }
            i++;
        }

        return o;
    } else if (id === undefined) { // return all data objects
        return data;
    } else {
        return null;
    }
};
