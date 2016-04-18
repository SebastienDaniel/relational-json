"use strict";

var formatDateString = require("../row/formatDateString"),
    validateDataType = require("../row/validateDataType");

function Field(f) {
    // basics
    this.dataType = f.dataType;
    this.allowNull = f.allowNull;
    if (f.defaultValue !== undefined) {
        this.defaultValue = f.defaultValue;
    }
    this.writable = f.writable || false;
}

Field.prototype = {
    adaptData: function(value) {
        if (this.dataType === "datetime") {
            return formatDateString(value);
        }

        return value;
    },
    isRequired: function() {
        return !this.allowNull && !this.hasOwnProperty("defaultValue");
    },
    validateData: function(value) {
        return validateDataType(this, value);
    }
};

module.exports = Field;
