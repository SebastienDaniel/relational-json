var prepPost = require("./prepPost");

module.exports = function post(c, d) {
    var obj;

    // make sure pk is unique
    if (c.rows.has(d[c.model.primary])) {
        throw Error("provided " + c.model.primary + ": " + d[c.model.primary] + " is already in use in " + c.model.tableName);
    } else {
        obj = prepPost(d, c);
        c.rows.add(d[c.model.primary], obj);

        return obj;
    }
};
