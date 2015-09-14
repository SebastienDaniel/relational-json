module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            src:  [ "src/scripts/**/*.js" ]
        },
        jscs: {
            src: [ "src/scripts/**/*.js" ]
        },
        uglify: {
            prod: {
                options: {
                    expand: true,
                    mangle: true,
                    compress: true
                },
                files: {
                    "relational-json.min.js": ["src/scripts/rJSON.js"]
                }
            }
        },
        jsdoc: {
            src: ["src/scripts/*.js", "!src/scripts/polyfills.js"],
            options: {
                destination: "doc",
                private: false
            }
        },
        browserify: {
            "build/assets/js/bundle.js": "src/browserify-input.js"
        },
        mochaTest: {
            src: ["test/**/*.js"]
        }
    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("test", ["jshint", "jscs", "mochaTest"]);
    grunt.registerTask("build", ["uglify:prod"]);
};
