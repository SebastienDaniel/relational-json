module.exports = function(grunt) {
    require('load-grunt-config')(grunt);

    grunt.registerTask("test", ["jscs", "jshint", "mocha_istanbul"]);
    grunt.registerTask("document", ["exec:doc"]);
};
