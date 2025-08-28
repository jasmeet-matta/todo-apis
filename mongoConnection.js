require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
console.log(dbPassword);
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://jasmeetmatta:${dbPassword}@cluster0.vfums6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const databaseName = "myDb";
const collectionName = "todo";
let db;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  let result = await client.connect();
  db = result.db(databaseName);
  // Send a ping to confirm a successful connection
  await client.db(databaseName).command({ ping: 1 });
  console.log("Pinged your deployment. Todo successfully connected to MongoDB!");
  return db.collection(collectionName);
}
// run().catch(console.dir);

module.exports = run;
