module.exports = function get() {
    var aL = arguments.length,
        a,
        i;

    if (aL === 0) {
        return this.all();
    } else if (aL === 1) {
        return this.get(arguments[0]);
    } else {
        a = [];

        for (i = 0; i < aL; i++) {
            a.push(this.get(arguments[i]));
        }

        return a;
    }
};
