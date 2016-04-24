"use strict";

var validateDataType = require("../row/validateDataType");

function Field(n, f) {
    // basics
    this.name = n;
    this.dataType = f.dataType;
    this.allowNull = f.allowNull || false;
    if (f.defaultValue !== undefined) {
        this.defaultValue = f.defaultValue;
    } else if (f.allowNull) {
        // TODO: should warn user about this case during schema validation
        this.defaultValue = null;
    }

    return Object.freeze(this);
}

Field.prototype = {
    isRequired: function() {
        return !this.allowNull && !this.hasOwnProperty("defaultValue");
    },
    validateData: function(value) {
        return validateDataType(this, value);
    }
};

module.exports = Field;
