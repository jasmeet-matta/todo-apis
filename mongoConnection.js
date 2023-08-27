const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://jasmeetmatta:SKw0OTT8t2c6jlor@cluster0.vfums6e.mongodb.net/?retryWrites=true&w=majority";
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
