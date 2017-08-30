/**
 * @typedef key
 * @summary used to uniquely identify an entry. All keys are coerced into strings.
 * The Dictionary's data object is deprived of any built-in properties or methods and has no prototype,
 * this greatly reduces the risk of key collisions.
 */

/**
 * @constructor
 * @summary the Dictionary stores key:value pairs of data. The keys are strings, the data can be anything.
 * A Dictionary is fast for create/read/update/remove actions,
 * as well is searching for entries that can be uniquely identified by their key
 * @returns {Dictionary}
 */
function Dictionary() {
    if (!(this instanceof Dictionary)) {
        return new Dictionary();
    }

    /**
     * @type {Object}
     * @summary "private" data used by the dictionary.
     * It is strongly recommended that you use the dictionary's API for data manipulation
     * @private
     */
    Object.defineProperty(this, '_data', {
        value: {}
    });
}


Dictionary.prototype = {
    /**
     * @memberof Dictionary
     * @summary returns an array of the values contained in the Dictionary
     * @returns {Array}
     */
    getValues: function getValues() {
        return Object.keys(this._data).map(function(key) {
            return this._data[key];
        }, this);
    },

    /**
     * @memberof Dictionary
     * @summary return an array of all existing keys in the dictionary
     * @returns {Array}
     */
    getKeys: function getKeys() {
        return Object.keys(this._data);
    },

    /**
     * @memberof Dictionary
     * @summary returns the stored value, identified by its key, otherwise undefined
     * @param {key} key
     * @returns {*}
     */
    get: function get(key) {
        return this._data[key];
    },

    /**
     * @memberof Dictionary
     * @param {key} key
     * @param {*} value - value to bind to the key
     * @returns {Dictionary}
     */
    set: function set(key, value) {
        // monadic handler
        if (key && typeof key === 'object') {
            Object.keys(key).forEach(function(k) {
                this.set(k, key[k]);
            }, this);
        } else {
            // set new entry
            this._data[key] = value;
        }

        return this;
    },

    /**
     * @memberof Dictionary
     * @summary deletes the key:value pair from the Dictionary's data, if present.
     * @param {key} key
     * @returns {Dictionary}
     */
    remove: function remove(key) {
        if (this.hasKey(key)) {
            // remove from dictionary
            delete this._data[key];
        }

        return this;
    },

    /**
     * @memberof Dictionary
     * @summary tests if the given key exists in the Dictionary
     * @param {key} key
     * @returns {boolean}
     */
    hasKey: function hasKey(key) {
        return Object.prototype.hasOwnProperty.call(this._data, key);
    },

    /**
     * @memberof Dictionary
     * @summary searches the entire dictionary until the value is found (strict equality)
     * @param {*} value - value to find
     * @returns {boolean}
     */
    hasValue: function hasValue(value) {
        return Object.keys(this._data).some(function(key) {
            return this._data[key] === value;
        }, this);
    },

    /**
     * @memberof Dictionary
     * @summary passes each pair in the dictionary through the provided callback function.
     * The callback is called with four arguments (key, value, index, array),
     * where array is the array-representation of the Dictionary's data
     * @param {function} cb - callback
     * @returns {Dictionary}
     */
    forEach: function forEach(cb) {
        if (typeof cb !== 'function') {
            throw new TypeError('Dictionary.forEach() expects a function as argument. Provided\n' + cb + ' (' + typeof cb + ')');
        }
        Object.keys(this._data).forEach(function(key, i, a) {
            cb(key, this._data[key], i, a);
        }, this);

        return this;
    },

    /**
     * @memberof Dictionary
     * @summary removes all pairs in the dictionary. This is a fairly slow operation, use with caution.
     * @returns {Dictionary}
     */
    clear: function clear() {
        Object.keys(this._data).forEach(function(key) {
            delete this._data[key];
        }, this);

        return this;
    },

    /**
     * @memberof Dictionary
     * @summary tests if the dictionary contains any keys
     * @returns {boolean}
     */
    isEmpty: function isEmpty() {
        return Object.keys(this._data).length === 0;
    }
};

module.exports = Dictionary;
