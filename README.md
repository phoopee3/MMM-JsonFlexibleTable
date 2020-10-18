# MMM-JsonFlexibleTable
A module for MagicMirror which allows the user to create a table based off of a json request.

The table columns can be defined in the config object.

All the variables of the objects in the array are represented by a table column.

If it's not obvious already this is based off of [MMM-JsonTable](https://github.com/timdows/MMM-JsonTable) and I just added some more configuration options to it.

## Installation

Go to your Magic Mirror install, then into the modules folder.

Clone the repo by typing:

````
git clone https://github.com/phoopee3/MMM-JsonFlexibleTable.git
````

You could also download a zip and unzip it to your modules folder.

## Configuration

I'm using this for pulling in Jira tickets, so I wanted a header of "Key" and "Summary". And all of the issues were in an array named `issues`.

Paste this into your `config.js` file where you want it to appear.

```json
{
    module:"MMM-JsonFlexibleTable",
    header: "Jira - In Progress",
    position: "top_left",
    config: {
        // maximumEntries : 0,
        url: "https://path.to/your/json",
        iterator : "issues",
        columns : [
            {
                name:"key",
                label:"Key"
            },
            {
                name:"fields.summary",
                label:"Summary"
            }
        ]
    }
},
```

## Config Options
| **Option**                                                              | **Default**                     | **Description**                                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| columns                                                                 | [ { name: "", label : "" }... ] | Array of objects that represent the json object to reference (name) and the table heading label (label)                         |
| iterator                                                                | ""                              | String that is the base parameter to loop over                                                                                  |
| maximumEntries                                                          | 0                               | The number of entries to show - 0 will show all that are returned                                                               |
| updateInterval                                                          | 15000                           | Milliseconds between the refersh                                                                                                |
| url                                                                     | ""                              | The full url to get the json response from                                                                                      |
|The parameters below are still defined from MMM-JsonTable and I will be removing or refactoring them|
| ~~arrayName~~                                                           | null                            | Define the name of the variable that holds the array to display                                                                 |
| ~~descriptiveRow~~                                                      | ""                              | Complete html table row that will be added above the array data                                                                 |
| ~~keepColumns~~                                                         | []                              | Columns on json will be showed                                                                                                  |
| ~~size~~                                                                | 0-3                             | Text size at table, 0 is default, and 3 is H3                                                                                   |
| ~~tryFormatDate~~                                                       | false                           | For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise |
