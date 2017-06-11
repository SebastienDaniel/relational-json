module.exports = function(grunt) {
    require('load-grunt-config')(grunt);

    grunt.registerTask("test", ["exec:eslint", "mocha_istanbul"]);
    grunt.registerTask("document", ["exec:doc"]);
};
