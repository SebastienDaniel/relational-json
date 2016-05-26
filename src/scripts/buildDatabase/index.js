var dictionary = require("./dictionaryFactory");

function buildDatabase(dynamicModel) {
    return Object.keys(dynamicModel).reduce(function(db, key) {
        db[key] = dictionary();
    }, Object.create(null));
}

module.exports = buildDatabase;