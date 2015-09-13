module.exports = function(xmlFile, jsonFile) {
    var fs = require("fs"),
        xml = fs.readFileSync(xmlFile, "utf8"),
        json = fs.readFileSync(jsonFile, "utf8"),
        xmlAliases = xml.match(/(<composite alias="\w*)"|(<aggregate alias="\w*)"/g).map(function(s) {
                return s.replace(/(<composite alias=)|(<aggregate alias=)|"/g, "");
            }),
        jsonAliases = json.match(/"alias"\:"(\w*)",?/g).map(function(s) {
            return s.replace(/"alias"\:|"|,/g,"");
        }),
        output;

    // add all JSON extensions because the XML version treats them as aggregations
    json = JSON.parse(json);
    Object.keys(json).forEach(function(key) {
        if (json[key].extends) {
            console.log("pushing: " + key);
            jsonAliases.push(key);
        }
    });

    output = "JSON vs XML:\n";

    jsonAliases.forEach(function(ja) {
        if (!xmlAliases.some(function(xa) {
            return xa === ja;
        })) {
            output += ja + "\n";
        }
    });

    output += "\n\n\nXML vs JSON:\n";

    xmlAliases.forEach(function(xa) {
        if (!jsonAliases.some(function(ja) {
                return xa === ja;
            })) {
            output += xa + "\n";
        }
    });

    fs.writeFileSync("src/scripts/build-graph/build/missing-alias.json", output, "utf8");
};
