require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const dbPassword = process.env.DB_PASSWORD;
const uri = `mongodb+srv://jasmeetmatta:${dbPassword}@cluster0.vfums6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const databaseName = "myDb";
const collectionName = "todo";

let client;
let collection;

// This will connect once and reuse the same collection
async function connectDb() {
  if (!collection) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    const db = client.db(databaseName);
    collection = db.collection(collectionName);
    console.log(`✅ Connected to MongoDB: ${databaseName}.${collectionName}`);
  }
  return collection;
}

module.exports = connectDb;
