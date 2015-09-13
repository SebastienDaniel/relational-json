(function build() {
    var sqlParser = require("./sql-parsers/MySQL-workbench-parser.js"),
        comparer = require("./sql-parsers/alias-comparison.js");

    sqlParser("src/scripts/build-graph/sql/dump.sql");
    comparer("src/scripts/build-graph/xml/dump.xml", "src/scripts/build-graph/build/graph.json");
}());
