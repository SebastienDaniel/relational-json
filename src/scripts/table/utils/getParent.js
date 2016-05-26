function getParent(model, row) {
    if (model.extends) {
        return {
            model: model.extends.model,
            row: Object.getPrototypeOf(row)
        };
    }
}

module.exports = getParent;
