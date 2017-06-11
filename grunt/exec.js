module.exports = {
	test_build: "browserify build/assets/js/setup.js -s setup > build/assets/js/setup.bundle.js -d --full-paths",
	doc: "node ./node_modules/.bin/jsdoc2md -t ./readme.hbs src/scripts/**/*.js > README.md",
	full_doc: "node ./node_modules/.bin/jsdoc2md -t readme.hbs --private src/scripts/**/*.js > DEV_README.md",
	eslint: "node ./node_modules/.bin/eslint src/**/*.js"
};
