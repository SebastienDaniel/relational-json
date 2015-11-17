var deepCopy = require("../src/scripts/deepCopy"),
    chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./test-graph.json"));

describe("table.meta.aliasMap", function() {
    it("should return alias:tableName object map of aggregate relations", function() {
        expect(db.Entity.meta.aliasMap).to.eql({
            ExternalLinks: "ExternalLink"
        });

        expect(db.InternalEntity.meta.aliasMap).to.eql({
            ModifiedBy: "InternalEntity",
            InternalEntities: "InternalEntity",
            ExternalLinks: "ExternalLink"
        });

        expect(db.Person.meta.aliasMap).to.eql({
            Organization: "Organization",
            ExternalLinks: "ExternalLink"
        });

        expect(db.Organization.meta.aliasMap).to.eql({
            ParentOrganization: "Organization",
            Organizations: "Organization",
            Persons: "Person",
            ExternalLinks: "ExternalLink"
        });
    });
});
