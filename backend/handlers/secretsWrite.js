// backend/handlers/secretsWrite.js
const { createSecret, updateSecret, deleteSecret } = require("../models/secretModel");
const { success, error } = require("../utils/response");
const { encryptSecret } = require("../services/encryptionService");

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const method = event.httpMethod;

    if (method === "POST") {
      if (!body.name || !body.value) return error("name and value required", 400);
      const encrypted = await encryptSecret(body.value);

      const result = await createSecret(body.name, encrypted);
      return success(result);
    }

    if (method === "PUT") {
      // update by creating new version or replacing current doc (simple)
      const id = event.pathParameters?.id;
      if (!id) return error("id required", 400);
      if (!body.value) return error("value required", 400);

      const encrypted = await encryptSecret(body.value);
      const result = await updateSecret(id, encrypted);
      return success(result);
    }

    if (method === "DELETE") {
      const id = event.pathParameters?.id;
      if (!id) return error("id required", 400);
      await deleteSecret(id);
      return success({ message: "deleted" });
    }

    return error("unsupported method", 400);
  } catch (err) {
    console.error(err);
    return error(err.message || "internal error", 500);
  }
};
