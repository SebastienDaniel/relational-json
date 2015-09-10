var assert = require("chai").assert,
    filter = require("../src/scripts/filtering/filter.class.js"),
    data = {
        id: 1,
        first_name: "Sebastien",
        last_name: "Daniel",
        Organization: {
            id: 10,
            name: "Handy ERP",
            employees: 55,
            ParentOrg: {
                id: 100,
                name: "E-vocation",
                industry: "technology",
                Persons: [
                    {id:33,name:"bob"},
                    {id:44,name:"dole"}
                ]
            }
        },
        ContactValues: [
            {
                id: 2,
                value: "bastinus@hotmail.com",
                type: "email"
            },
            {
                id: 3,
                value: "1 514 799 0958",
                type: "mobile"
            }
        ]
    };

describe("filter", function() {
    var mold = {
            id: undefined,
            name: undefined
        };

    it("should filter single level object", function() {
        assert(filter(mold, data.Organization.ParentOrg), {
            id: 100,
            name: "E-vocation"
        });
        assert(filter(mold, data.Organization), {
            id: 10,
            name: "Handy ERP"
        });
    });

    mold = {
        id: undefined,
        first_name: undefined,
        Organization: {
            id: undefined,
            name: undefined
        }
    };

    it("should filter double level object", function() {
        assert(filter(mold, data), {
            id: 1,
            first_name: "Sebastien",
            Organization: {
                id: 10,
                name: "Handy ERP"
            }
        });
        assert(filter(mold, data.Organization), {
            id: 10
        });
    });

    mold = {
        id: undefined,
        first_name: undefined,
        Organization: {
            id: undefined,
            name: undefined,
            ParentOrg: {
                id: undefined,
                name: undefined
            }
        },
        ContactValues: {
            value: undefined
        }
    };

    it("should filter double level object with arrays", function() {
        assert(filter(mold, data), {
            id:1,
            first_name:"Sebastien",
            Organization: {
                id:10,
                name:"Handy ERP",
                ParentOrg: {
                    id: 100,
                    name: "E-vocation"
                }
            },
            ContactValues: [
                {value: "bastinus@hotmail.com"},
                {value: "1 514 799 0958"}
            ]
        });
    });

    mold = {
        value: undefined
    };

    it("should filter from an array", function() {
        assert(filter(mold, data.ContactValues), [{value:"bastinus@hotmail.com"}, {value:"1 514 799 0958"}]);
    });

    mold = {
        whuut: undefined,
        whuutDeeper: {
            whutt3: undefined
        }
    },
        data2 = [{id:1},{id:2},{id:3}];

    it("should ignore unknown fields at any level", function() {
        assert(filter(mold, data), {});
    });

    it("should return an empty array if no objects have data", function() {
        assert(filter(mold, data2), []);
    });
});

