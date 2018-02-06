const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'project';

MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err;
    }

    console.log("Connected successfully to MongoDB server");

    const db = client.db(dbName);

    console.log("Connected successfully to MongoDB database");

    client.close();
});