// backend/test.js
require("dotenv").config();
const secretsWrite = require("./handlers/secretsWrite");
const secretsRead = require("./handlers/secretsRead");

async function run() {
  // create
  const eventCreate = {
    httpMethod: "POST",
    body: JSON.stringify({ name: "dev-demo", value: "super-secret-value-123" })
  };

  console.log("Creating secret...");
  const c = await secretsWrite.handler(eventCreate);
  console.log("CREATE RESPONSE:", c);

  // list
  const eventList = { httpMethod: "GET", pathParameters: null };
  const l = await secretsRead.handler(eventList);
  console.log("LIST RESPONSE:", l);

  // If created, try read by id (extract id if inserted)
  const createdBody = JSON.parse(c.body || "{}");
  const id = createdBody.id;
  if (id) {
    const getEvent = { httpMethod: "GET", pathParameters: { id } };
    const getRes = await secretsRead.handler(getEvent);
    console.log("GET RESPONSE:", getRes);
  } else {
    console.log("No id returned from create; skipping GET by id.");
  }
}

run().catch(err => {
  console.error("Test run failed:", err);
});
