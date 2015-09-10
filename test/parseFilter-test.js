var assert = require("chai").assert,
    parseFilter = require("../src/scripts/filtering/parseFilter.class.js");

describe("parseFilter", function() {
    var filter = "id,first_name,last_name";

    // 1 level
    it("should return an object from a single-level filter", function() {
        assert(parseFilter(filter), {
            id: undefined,
            first_name: undefined,
            last_name: undefined
        });
    });

    // 2 levels
    filter = "id,first_name,last_name,Organization(id,name)";
    it("should return a 2 level object from a double-level filter", function() {
        assert(parseFilter(filter), {
            id: undefined,
            first_name: undefined,
            last_name: undefined,
            Organization: {
                id: undefined,
                name: undefined
            }
        });
    });

    // mixed levels
    filter = "id,first_name,Organization(id,name,ParentOrg(id)),last_name,ContactValues(value)";
    it("should return a mixed level object from a complex filter", function() {
        assert(parseFilter(filter), {
            id: undefined,
            first_name: undefined,
            Organization: {
                id: undefined,
                name: undefined,
                ParentOrg: {
                    id: undefined
                }
            },
            last_name: undefined,
            ContactValues: {
                value: undefined
            }
        });
    });
});
