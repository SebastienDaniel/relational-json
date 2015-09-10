rJSON
===========
Relation data mapping in JSON-like syntax

rJSON expects a JSON object composed of "table" abstractions, containing Table ownerships, fields & owners. Below is an example three table graph with a bit of everything in it:

**basic structure**
```js
{
    TableName: {
        owns: {
            TableName: {
                local: "local_field_name",
                foreign: "foreign_field_name",
                cardinality: "single"|"many"
            }
        },
        extends: {
            table: "TableName",
            local: "",
            foreign: ""
        },
        fields: {
            fieldName: {
                dataType: "integer"|"date"|"datetime"|"time"|"string"|"boolean",
                primary: true|false,
                writable: true|false,
                enumerable: true|false,
                default: ""
            }
        }
    }
}
```
- **TableName**: a unique identifier that will be used to reference a module inside the generated graph. Modules are responsible for:
    - storing their data
    - controlling input
    - returning data
- **TableName.owns**: a table can "own" other tables, meaning that it will aggregate it's subjects' data into it's own structure.
    - **local**: refers to the local field name used to identify ownership.
    - **foreign**: refers to the owned table's field used to match ownership of data.
    - **cardinality**: determines whether the ownership is a single Object or an Array of objects, returned by the owned table.
- **extends**: a table can extend another table, meaning that it inherits it's parent table's fields. (*typically when a table extends another table, it has a common field (PK/FK), hiding the local PK is common*)
    - **table**: name of the parent table (must be a string)
    - **local**: local field name used to identify extension
    - **foreign**: parent table's field name used to identify extension
- **fields**: metadata of each field composing the table.
    - **primary**: determines which field will be used to filter data when making a selective get from a table. (*TableName.get(id)*)
    - **writable**: can the value be changed after creation.
    - **enumerable**: should this field show up on a data export.
    - **default**: default value. If a field doesn't have a default value, it will be considered "not-nullable", or mandatory.


```js
{
    Vehicle: {
        owns: {
            LicensePlate: {
                local: "license_plate_id",
                foreign: "id",
                cardinality: "single"
            }
        },
        fields: {
            id: {
                dataType: "integer",
                primary: true,
                writable: false,
                enumerable: true
            },
            created_on: {
                dataType: "datetime",
                writable: false,
                enumerable: true
            },
            color: {
                dataType: "string",
                writable: true,
                enumerable: true
            }
        }
    },
    Ferrari: {
        extends: {
            table: "Vehicle",
            local: "vehicle_id",
            foreign: "id",
            cardinality: "single"
        },
        fields: {
            vehicle_id: {
                dataType: "integer",
                writable: false,
                enumerable: false
            },
            km_traveled: {
                dataType: "integer",
                writable: true,
                enumerable: true
            }
        }
    },
    LicensePlate: {
        fields: {
            id: {
                dataType: "integer",
                primary: true,
                writable: false,
                enumerable: true
            },
            value: {
                dataType: "string",
                writable: false,
                enumerable: true
            },
            created_on: {
                dataType: "datetime",
                writable: false,
                enumerable: true
            }
        }
    }
}
```
