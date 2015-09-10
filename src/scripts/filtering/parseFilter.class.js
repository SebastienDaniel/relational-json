/**
 * @summary parses a string into a filter object, which can be used by the filter module.
 * The provided string has the following structure:
 *
 * property,property,Child(property)
 */
module.exports = (function() {
    var parts,
        pL,
        current,
        next,
        obj = Object.create(null),
        i = 0;

    function parseFilter(me) {
        while (i < pL) {
            current = parts[i];
            next = parts[i + 1];

            // end of child
            if (current === ")") {
                i++;
                return;

                // prop
            } else if (notParenthesis(current) && next !== "(") {
                me[current] = undefined;
                i++;

                // start of child
            } else if (notParenthesis(current) && next === "(") {
                me[current] = Object.create(null);
                i += 2;

                // loop inside
                parseFilter(me[current]);
            }
        }
    }

    function notParenthesis(str) {
        return str !== ")" && str !== "(";
    }

    return function(filter) {
        parts = filter.replace(" ","").split(/([,\(\)])/).filter(function(p) {
            return !(p === "" || p === ",");
        });
        pL = parts.length;
        obj = Object.create(null);

        parseFilter(obj);
        return obj;
    }
}());
