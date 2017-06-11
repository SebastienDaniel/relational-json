const getChild = require('./getChild');

function getFurthestChild(model, db, row) {
	const child = getChild(model, db, row);

	if (child) {
		return getFurthestChild(child.model, db, child.row);
	} else {
		return {
			model: model,
			row: row
		};
	}
}

module.exports = getFurthestChild;
