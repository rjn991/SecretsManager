// backend/handlers/secretsRead.js
const { getSecret, listSecrets } = require("../models/secretModel");
const { success, error } = require("../utils/response");
const { decryptSecret } = require("../services/encryptionService");

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    if (method === "GET" && !event.pathParameters?.id) {
      // list metadata only (do not include ciphertext fields)
      const rows = await listSecrets();
      return success(rows);
    }

    const id = event.pathParameters?.id;
    if (!id) return error("id required", 400);

    const stored = await getSecret(id);
    if (!stored) return error("not found", 404);

    // decrypt
    const value = await decryptSecret(stored);
    // return secret with metadata. Be mindful of exposing sensitive data in logs
    return success({ id: stored._id, name: stored.name, value, createdAt: stored.createdAt });
  } catch (err) {
    console.error(err);
    return error(err.message || "internal error", 500);
  }
};
