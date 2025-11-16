const { MongoClient } = require("mongodb");

let client = null;

async function connect() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("MongoDB Connected");
  }
  return client;
}

exports.db = async () => {
  const c = await connect();
  return c.db(process.env.DB_NAME);
};
