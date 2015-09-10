/**
 * @summary filter applies a string-based property filter to JSON data.
 * It essentially determines which pieces of data will be returned.
 * It can filter to any depth, and can filter primitives, objects & arrays.
 */
module.exports = (function() {
    function recursivePopulate(mold, data) {
        Object.keys(mold).forEach(function(key) {

            // if data isn't as deep as mold
            if (!data[key]) {
                delete mold[key];
                return;
            }

            // go to a deeper level
            if (Object.prototype.toString.call(mold[key]) === "[object Object]" && Object.prototype.toString.call(data[key]) !== "[object Array]") {
                recursivePopulate(mold[key], data[key]);

            // map the data array to the mold key
            } else if (Object.prototype.toString.call(mold[key]) === "[object Object]" && Object.prototype.toString.call(data[key]) === "[object Array]") {
                mold[key] = data[key].map(function(d) {
                    // make a COPY of the mold, otherwise you'll get references to the same mold object
                    var obj = {};
                    Object.keys(mold[key]).forEach(function(key) {
                        obj[key] = undefined
                    });

                    return recursivePopulate(obj, d);
                }).filter(function(f) {
                    // keep only objects with data
                    if (f && Object.keys(f).length > 0) {
                        return true
                    }
                });

            // apply the primitive value to mold key
            } else if (Object.prototype.toString.call(mold[key]) !== "[object Object]" && Object.prototype.toString.call(data[key]) !== "[object Array]") {
                mold[key] = data[key];

            }
        });

        return mold;
    }

    return function(m, d) {
        // throw error if mold or data are omitted
        if (!m || !d) {
            throw new Error("when filtering data you must provide a mold object and a data object or array");
        }

        // check if data starts as an array
        if (Object.prototype.toString.call(d) === "[object Array]") {
            // start mapping before recursion
            return d.map(function(d) {
                var obj = {};
                Object.keys(m).forEach(function(key) {
                    obj[key] = undefined
                });

                return recursivePopulate(obj, d);
            }).filter(function(f) {
                // keep only objects with data
                if (f && Object.keys(f).length > 0) {
                    return true
                }
            });
        } else {
            return recursivePopulate(m, d);
        }
    };
}());
