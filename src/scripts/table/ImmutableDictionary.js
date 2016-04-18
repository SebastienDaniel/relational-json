function referentialCopy(obj) {
    return Object.keys(obj).reduce(function(o, key) {
        o[key] = obj[key];
        return o;
    }, {});
}

function updateObject(oldObj, newObj) {
    var keys = Object.keys(oldObj),
        key,
        kL = keys.length - 1,
        o = {};

    while (kL) {
        key = keys[kL];
        o[key] = newObj[key] !== undefined ? newObj[key] : oldObj[key];
        kL--;
    }

    return o;
}

ImmutableDictionary.prototype = {
    all: function() {
        return Object.keys(this._data).map(function(key) {
            return this._data[key];
        }, this);
    },

    // add
    add: function(key, value) {
        if (this.has(key)) {
            this.put(key, value);
        } else {
            // create new data object to break reference and signify change
            this._data = referentialCopy(this._data);

            // add new entry
            this._data[key] = value;
        }

        return this;
    },

    // remove
    remove: function(key) {
        var prev;

        if (this.has(key)) {
            // store value
            prev = this._data[key];

            // remove from dictionary
            delete this._data[key];

            // create new data object to break reference and signify change
            this._data = referentialCopy(this._data);

            return prev;
        }
    },

    // get
    get: function(key) {
        return this._data[key];
    },

    // has
    has: function(key) {
        return !!this._data[key];
    },

    // update // convenience of remove + add
    update: function(key, value) {
        this.add(key, updateObject(this.remove(key), value));

        return this;
    }
};

function ImmutableDictionary() {
    this._data = {};
}

module.exports = ImmutableDictionary;
