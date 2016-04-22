module.exports = function get(args, rows) {
    var aL = args ? args.length : 0,
        a,
        i;

    if (aL === 0) {
        return rows.all();
    } else if (aL === 1) {
        return rows.get(args[0]);
    } else {
        a = [];

        for (i = 0; i < aL; i++) {
            a.push(rows.get(args[i]));
        }

        return a;
    }
};
