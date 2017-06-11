/**
 * @private
 * Attempts to validate data formats based on MySQL requirements & best-practices.
 * @param {object} field - field-portion of the model
 * @param {*} value - value to test against field's dataType
 * @returns {boolean}
 */
module.exports = function validateDataType(field, value) {
    // expected types: string, integer, float, date, time, datetime, boolean
	const type = typeof value;
	let result = false;

    // exception for nullable fields
	if (field.allowNull && value === null) {
		return true;
	}

	switch (field.dataType) {
	case 'string': {
		result = type === 'string';
		break;
	}

	case 'integer': {
		result = type === 'number' && /^[-+]?\d{1,20}$/.test(value.toString());
		break;
	}

	case 'float': {
		result = type === 'number' && /^[-+]?\d{1,20}(?:\.\d{1,20})?$/.test(value.toString());
		break;
	}

	case 'boolean': {
		result = type === 'boolean' && (value === true || value === false) || type === 'number' && (value === 1 || value === 0);
		break;
	}

	case 'date':
	case 'datetime': {
		result = !isNaN(Date.parse(value));

		break;
	}

	case 'time': {
		result = type === 'string' && /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}(\.[0-9]{1,6})?$/.test(value);
		break;
	}

	default: {
		throw new Error('Incompatible dataType: ' + type);
	}
	}

	return result;
};
