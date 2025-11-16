// backend/models/secretModel.js
const { db } = require("../services/mongoService");
const { ObjectId } = require("mongodb");

exports.createSecret = async (name, encryptedObj) => {
  const database = await db();
  const result = await database.collection("secrets").insertOne({
    name,
    ...encryptedObj,
    deleted: false,
    createdAt: new Date()
  });
  return { id: result.insertedId.toString(), name };
};

exports.getSecret = async (id) => {
  const database = await db();
  const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
  return database.collection("secrets").findOne({ _id, deleted: false });
};

exports.listSecrets = async () => {
  const database = await db();
  return database.collection("secrets")
    .find({ deleted: false })
    .project({ ciphertext: 0, dataKeyCiphertext: 0, authTag: 0, iv: 0 })
    .toArray();
};

exports.updateSecret = async (id, encryptedObj) => {
  const database = await db();
  const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
  const res = await database.collection("secrets").updateOne(
    { _id, deleted: false },
    { $set: { ...encryptedObj, updatedAt: new Date() } }
  );
  return { matched: res.matchedCount, modified: res.modifiedCount };
};

exports.deleteSecret = async (id) => {
  const database = await db();
  const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
  await database.collection("secrets").updateOne(
    { _id },
    { $set: { deleted: true, deletedAt: new Date() } }
  );
};
