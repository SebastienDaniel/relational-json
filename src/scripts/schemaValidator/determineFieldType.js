function determineFieldType(field) {
    "use strict";

    return typeof field === "string" ? field : field.dataType;
}

module.exports = determineFieldType;
