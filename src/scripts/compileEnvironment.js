"use strict";

module.exports = function compileEnvironment(options) {
    var o = Object.create(null, {});

    if (options && typeof options.preprocessor === "function") {
        o.preprocessor = options.preprocessor;
    }

    o.db = Object.create(null, {});

    return o;
};
