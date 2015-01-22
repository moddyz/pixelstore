/*
 * setup.js
 * ========
 * This is a setup script to create the keyspace for our
 * store and to set-up the tables.
 */

var cassandra = require("cassandra-driver");
var fs = require("fs");

console.log("\n===================")
console.log("Store Set-up Script")
console.log("===================\n")

// create, destroy
var command = process.argv[2];

fs.readFile("../config.json", function (error, data) {
    var config = JSON.parse(data);

    console.log("keyspace: " + config.cassandra.keyspace);
    console.log("contactPoints: " + config.cassandra.contactPoints.join(", "));
    console.log();

    var client = new cassandra.Client({contactPoints: config.cassandra.contactPoints});
    
    if (command === 'create') {    
        console.log("Creating keyspace...");

        createKeyspaceQuery = "CREATE KEYSPACE " + config.cassandra.keyspace + " " +
                                  "WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }";

        console.log("Executing: \n" + createKeyspaceQuery + "\n");
        
        client.execute(createKeyspaceQuery, [], {prepare: true}, function (err) {
            if (err)
                throw Error(err)
            console.log("Keyspace " + config.cassandra.keyspace + " created...");
            client.shutdown();
        });
    } else if (command === 'destory') {
        console.log("destroying keyspace...");
    } else {
        console.log("Unknown command '" + command + "'.\nAvailable commands: 'create', 'destroy'");
    }
});
