# Getting started
### Install relational-json

`npm install relational-json --save`

### Require
Relational-json is quite straight-forward. You require relational-json into your source:

`var rJSON = require("relational-json");`

and you create a db based on a schema you provide:

`var db = rJSON(schema);`

----------------------------

### How it works
Relational-json wraps your primitive data (*strings, numbers, booleans*) in an immutable & relational structure. The format is just like JSON, except your data can reference other parts of your data tree. This is done dynamically, thanks to ES5 object getters & setters.
Each object created inside relational-json is "pure", in the sense that it has no native prototype. This allows us to leverage JavaScripts prototypical inheritance in very elegant ways.

*IMPORTANT: that means relational-json is IE9+ compatible, but **cannot be shimmed or polyfilled** for older browsers.*

### Why use it
When building web applications, odds are your data will be in JSON format, even if not, it will still most likely be stored in javascript objects & arrays. This can quickly become problematic
when parts of your data are related to other parts of your data. When you update a value, you have to make sure the change propagates everywhere. Relational-json makes all of that simpler:

1. It eliminates data duplication
2. It simplifies data updates (*you only ever need to modify data in 1 place, since there are no duplicates*)
3. It encapsulates your data, data manipulation logic and restricts certain operations (*such as wrong datatype in a given field*)
4. It's extremely portable, since the data uses the well-known JSON syntax.
5. It makes no environment assumptions (*can be used in browser, on node, etc.*)

## Limitation
Because of it's referential nature, `JSON.stringify()` does not work as expected. This is due to *infinite nesting*, which makes you
jump from prototype to child and back again, infinitely, if you don't control the data traversal.
(*we provide a simple utility, which entirely mitigates the issue*)

------------------------------

## The schema
Relational-json expects a javascript-object schema representing the data tree you wish to use. Below is a break down of the schema notation:

```js
{
    tableName: {
        primary: "field to use as unique identifier. Field must be in fields object.",
        fields: {
            fieldName: {
                allowNull: "can the value be set to null (true / false)",
                dataType: "datatype of the field (string, integer, float, date, time, datetime, boolean)",
                defaultValue: "value to use if none provided at creation time"
            }
        },
        extends: {
            table: "tableName that is a parent of this table",
            localField: "own field that references parent table",
            foreignField: "parent table field that localField is matched with"
        },
        aggregates: [
            {
                table: "tableName that is aggregated",
                alias: "property alias to use for relation",
                localField: "local field used to build aggregate relations",
                foreignField: "foreign field used in aggregate relation",
                cardinality: "(single / many), a single relation provides a direct relation to another object. A many relation creates an array of objects"
            }
        ]
    }
}
```

### Schema relations
#### extends
Extends is an **inheritance** pattern. It signifies that the table is the *child* of another table. Concretely, every row object created in this table will use a row object from the parent table as **prototype**.
The `extends` relationship is also reflected in the parent tables' rows, which will contain a property to the child row. This will allow you to traverse your data trees in both directions (*up and down*).

**extends example**
```js
var schema = {
    Vehicle: {
        primary: "id",
        fields: {
            id: {allowNull: false, dataType: "integer"},
            year: {allowNull: false, dataType: "integer"},
            maker: {allowNull: true, dataType: "string"}
        }
    },
    Car: {
        primary: "id",
        fields: {
            id: {allowNull: false, dataType: "integer"},
            model: {allowNull: false, dataType: "string"}
        },
        extends: {table: "Vehicle", localField: "id", foreignField: "id"}
    }
};

var db = rJSON(schema);

db.Car.post({
    id: 1,
    year: 2001,
    maker: "Toyota",
    model: "Camry"
});

db.Car.get(1);
/*  own props
    {
        id: 1,
        model: "Camry"
    }
*/

// prototype props
db.Car.get(1).year; // 2001
db.Car.get(1).maker; // "Toyota"

db.Vehicle.get(1);
/*
{
    id: 1,
    year: 2001,
    maker: "Toyota",
    Car: {
        id: 1,
        model: "Camry"
    }
}
*/
```

#### aggregates
This a composite relation between tables, not inheritance-based. Concretely, if table A "aggregates" table B, rows from table A will have a property pointing to one row (*object*) or many rows (*array*) from table B, based on the relations cardinality.
Unlike `extends`, aggregate does not affect the prototype chain.

**aggregates example (single)**
```js
var schema = {
    Vehicle: {
        primary: "id",
        fields: {
            id: {allowNull: false, dataType: "integer"},
            year: {allowNull: false, dataType: "integer"},
            maker: {allowNull: true, dataType: "string"}
        }
    },
    Client: {
        primary: "id",
        fields: {
            id: {allowNull: false, dataType: "integer"},
            name: {allowNull: false, dataType: "string"},
            vehicle_id: {allowNull: true, dataType: "integer"}
        },
        aggregates: [
            {table: "Vehicle", alias: "Vehicle", localField: "vehicle_id", foreignField: "id", cardinality: "single"}
        ]
    }
};

var db = rJSON(schema);

db.Vehicle.post({
    id: 1,
    year: 2001,
    maker: "hyundai"
});

db.Client.post({
    id: 2,
    name: "bob the builder",
    vehicle_id: 1
});

db.Client.get(2);
/*
{
    id: 2,
    name: "bob the builder",
    Vehicle: {
        id: 1,
        year: 2001,
        maker: "hyundai"
    }
}
*/
```

-------------------------------

<a name="Table"></a>

## Table : <code>object</code>
**Kind**: global typedef  
**Summary**: Once relational-json parsed your schema, it will return your relational database, which will be a collection of all the Tables in your data.
Each Table uses an internal Dictionary to store, retrieve and manipulate it's data (rows).
Tables are essentially the interface through which you manipulate data.  

* [Table](#Table) : <code>object</code>
    * [.meta](#Table+meta) : <code>object</code>
    * [.get()](#Table+get) ⇒ <code>object</code> &#124; <code>Array.&lt;object&gt;</code>
    * [.post(d)](#Table+post) ⇒ <code>object</code>
    * [.put(d, pkValue)](#Table+put) ⇒ <code>object</code>
    * [.delete(id)](#Table+delete) ⇒ <code>object</code>

<a name="Table+meta"></a>

### table.meta : <code>object</code>
**Kind**: instance property of <code>[Table](#Table)</code>  
**Summary**: partial interface into the Table's inner details  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Table's property key in the relational-json database |
| pk | <code>string</code> | name of the Table's primary field |
| primary | <code>string</code> | alias of Table.meta.pk |
| aliasMap | <code>object</code> | hashmap of the the table's rows' properties pointing to other tables in the relational-json database |
| ownRequiredFields | <code>Array.&lt;string&gt;</code> | list of all own required fields, which must have a value at all times |
| allRequiredFields | <code>Array.&lt;string&gt;</code> | list of all required fields, including own & ancestors' required fields |

<a name="Table+get"></a>

### table.get() ⇒ <code>object</code> &#124; <code>Array.&lt;object&gt;</code>
**Kind**: instance method of <code>[Table](#Table)</code>  
**Summary**: returns row data matching the provided arguments on their primary field value  
**Returns**: <code>object</code> &#124; <code>Array.&lt;object&gt;</code> - if no argument is provided, it returns an array of all data within the table.
if 1 argument is provided, it returns that row object
if many arguments are provided, it returns an array containing those row objects  
<a name="Table+post"></a>

### table.post(d) ⇒ <code>object</code>
**Kind**: instance method of <code>[Table](#Table)</code>  
**Summary**: creates a new row of data  
**Returns**: <code>object</code> - row instance created  

| Param | Type | Description |
| --- | --- | --- |
| d | <code>object</code> | data bundle, must contain all required fields |

<a name="Table+put"></a>

### table.put(d, pkValue) ⇒ <code>object</code>
**Kind**: instance method of <code>[Table](#Table)</code>  
**Summary**: modifies a data row, by re-creating the row merged with the new data  
**Returns**: <code>object</code> - newly created row  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| d | <code>object</code> |  | field:value object of data to modify |
| pkValue | <code>\*</code> | <code>d.primary</code> | primary value to find row to modify |

<a name="Table+delete"></a>

### table.delete(id) ⇒ <code>object</code>
**Kind**: instance method of <code>[Table](#Table)</code>  
**Summary**: recursively deletes the target row and it's children (if any)  
**Returns**: <code>object</code> - deleted row  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | primary field value of row to delete |

