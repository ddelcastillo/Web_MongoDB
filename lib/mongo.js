const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const conn = MongoClient.connect(url, { useUnifiedTopology: true });

module.exports = conn;
