module.exports = {
    readme: {
        options: {
            "no-gfm": true,
            "private": false,
            "template": "docTemplate"
        },
        src: 'src/scripts/**/*.js',
        dest: 'README.md'
    },
    developer: {
        options: {
            "no-gfm": true,
            "private": true
        },
        src: "src/scripts/**/*.js",
        dest: "README_DEV.md"
    }
};
