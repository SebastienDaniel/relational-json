function determineFieldType(field) {
    return typeof field === "string" ? field : field.dataType;
}

module.exports = determineFieldType;
