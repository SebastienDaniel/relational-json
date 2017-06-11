/**
 * @private
 * @summary assumes that ALL possible fields are ALWAYS present on a row
 * scans based on current row, to find applicable keys
 * @param c
 * @param oldO
 * @param newO
 * @returns {boolean}
 */
function dataDiffers(oldObject, newObject) {
	return Object.keys(oldObject).some(function(key) {
		if (oldObject[key] !== undefined && typeof oldObject[key] !== 'object') {
			return oldObject[key] !== newObject[key];
		}
	});
}

module.exports = dataDiffers;
