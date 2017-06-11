/**
 * @private
 * @summary compiles an array of all required field names to create a data object
 * for the provided table model
 * @param {object} model - table model to scan
 * @param {object} [type] - "own" or "all"
 * @returns {Array}
 */
function getRequiredFields(model, type) {
    // get models' own required fields
	var req = model.listFields()
        .filter((field) => field.isRequired)
        .map((field) => field.name);

	if (type === 'all' && model.extends) {
        // add ancestors' requirements
		const parentModel = model.extends.model;
		req = req.concat(getRequiredFields(parentModel, 'all'));

        // remove the parent<->child extension field,
        // it can be inferred at data creation time
		const foreignField = model.extends.foreignField;
		req.splice(req.indexOf(foreignField), 1);
	}

	return req;
}

module.exports = getRequiredFields;
