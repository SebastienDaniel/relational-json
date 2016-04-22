Dictionary.prototype = {
    all: function() {
        return Object.keys(this._data).map(function(key) {
            return this._data[key];
        }, this);
    },

    // add
    add: function(key, value) {
        if (this.has(key)) {
            throw Error("Dictionary already has a value for key: " + key + "\nUse update(key, value) instead");
        } else {
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
    }
};

function Dictionary() {
    this._data = {};
}

module.exports = Dictionary;
