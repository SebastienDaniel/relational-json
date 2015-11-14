module.exports = function getData(id, pk, data) {
    var o,
        i;

    if (id !== null && id !== undefined) { // return specific data object
        // id must be an integer
        try {
            if (!/^[+-]?[0-9]*$/.test(id)) {
                throw Error("cannot get data from id: " + id);
            } else {
                // make sure it's integer
                id = parseInt(id, 10);
            }
        } catch (msg) {
            console.log(msg);
        }

        i = data.length;
        while (i) {
            i--;
            if (data[i][pk] === id) {
                o = data[i];
                i = 0;
            }
        }
        return o;
    } else if (id === undefined) { // return all data objects
        return data;
    } else if (id === null) {
        return null;
    }
};
