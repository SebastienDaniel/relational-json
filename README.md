rJSON
===========
Relation data mapping in JSON-like syntax

rJSON expects a JSON object composed of "table" abstractions, containing Table ownerships, fields & owners. Below is an example three table graph with a bit of everything in it:

**basic structure**
```js
{
    TableName: {
        "extends": {
            "table": "TableName",
            "local": "",
            "foreign": ""
        },
        "fields": {
            "fieldName": {
                "dataType": "integer"|"date"|"datetime"|"time"|"string"|"boolean",
                "primary": true|false,
                "writable": true|false,
                "defaultValue": ""
            }
        },
        "aggregates": [
            {
                "foreignTable": "",
                "localField": "",
                "alias": "",
                "foreignField": "",
                "cardinality": "single"|"many"
            }
        ]
    }
}
```

**TableName**: a unique identifier that will be used to reference a module inside the generated graph. Modules are responsible for:
    - storing their data
    - controlling input
    - returning data

**aggregates**: a table can "aggregate" other tables, meaning that it will aggregate it's subjects' data into it's own structure.
    - **foreignTable**: name of the table aggregated.
    - **alias**: alias used as a new field in the owning tables' data structures (where it imports the aggregates' data).
    - **localField**: refers to the local field name used to identify ownership.
    - **foreignField**: refers to the owned table's field used to match ownership of data.
    - **cardinality**: determines whether the ownership is a single Object or an Array of objects, returned by the owned table.

**extends**: a table can extend another table, meaning that it inherits it's parent table's fields. (*typically when a table extends another table, it has a common field (PK/FK), hiding the local PK is common*)
    - **table**: name of the parent table (must be a string)
    - **local**: local field name used to identify extension
    - **foreign**: parent table's field name used to identify extension

**fields**: metadata of each field composing the table.
    - **primary**: determines which field will be used to filter data when making a selective get from a table. (*TableName.get(id)*)
    - **writable**: can the value be changed after creation.
    - **enumerable**: should this field show up on a data export.
    - **default**: default value. If a field doesn't have a default value, it will be considered "not-nullable", or mandatory.
