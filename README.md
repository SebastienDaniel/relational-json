# Relational JSON
### Converts a JSON data-schema into a relational data store
Takes a JSON data structure and converts it into a database-like module allowing easy CRUD operations on immutable & relational objects (*no data duplication*).

## Installation
```
npm install relational-json --save
```

## JSON data structure
Create your relational data-structure (*JSON format*) following the instructions below:
```js
{
  "TableName": {
    "fields": {}, // fields or columns of the data table
    "primary": "", // primary field of the table
    "aggregates": [], // relations to other tables
    "extends": "", // parent table (inheritance) 
    "extendedBy": [] // child tables (inheritance)
  }
}
```

### Tables
Your JSON data structure can contain any amount of tables. Each table must respect the following points:
- Table names must be unique.
- Tables must have a **primary** property (*the name of the primary field of the table*)
- Tables must have fields, which minimally contains the primary field of the table.

### Table fields
Every Table in your relational structure must have fields. Fields describe the nature of your data and the constraints that relational-json will enforce during POST and PUT operations.
Fields have the following properties:
- **dataType**: the primitive type of your data. Supported types are:
  - string
  - date (*ISO format*)
  - time (*ISO format*)
  - datetime (*ISO format*)
  - integer
  - float
  - boolean (*true, false, 0, 1*)
- **allowNull**: whether the value can be set to *null* or not.
- **defaultValue**: the default value use on a POST operation, if no value is provided.
  
#### Table fields, example
```json
{
  "TableName": {
    "primary": "id",
    "fields": {
      "id": {
        "allowNull": false,
        "dataType": "integer"
      },
      "title": {
        "allowNull": false,
        "dataType": "string"
      },
      "is_active": {
        "allowNull": false,
        "defaultValue": 1,
        "dataType: "boolean"
      }
    }
  }
}
```


