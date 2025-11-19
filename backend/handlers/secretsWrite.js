const { createSecret, updateSecret, deleteSecret } = require("../models/secretModel");
const { success, error } = require("../utils/response");
const { encryptSecret } = require("../services/encryptionService");

exports.handler = async (event) => {
  try {
    console.log("=== RAW EVENT START ===");
    console.log(JSON.stringify(event, null, 2));
    console.log("=== RAW EVENT END ===");

    // Correct method detection for HTTP API v2
    const method = event.requestContext?.http?.method?.toUpperCase();
    const path = event.rawPath;

    console.log("METHOD USED:", method);

    // Body parsing
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        console.log("Body parse error:", e);
      }
    }

    // POST /secrets → Create secret
    if (method === "POST" && path === "/secrets") {
      if (!body.name || !body.value) return error("name and value required", 400);

      const encrypted = await encryptSecret(body.value);
      const result = await createSecret(body.name, encrypted);

      return success(result);
    }

    // PUT /secrets/{id}
    if (method === "PUT") {
      const id = event.pathParameters?.id;
      if (!id) return error("id required", 400);

      const encrypted = await encryptSecret(body.value);
      const result = await updateSecret(id, encrypted);
      return success(result);
    }

    // DELETE /secrets/{id}
    if (method === "DELETE") {
      const id = event.pathParameters?.id;
      if (!id) return error("id required", 400);

      await deleteSecret(id);
      return success({ message: "deleted" });
    }

    // Fallback
    return error("unsupported method", 400);

  } catch (err) {
    console.error("ERROR:", err);
    return error(err.message || "internal error", 500);
  }
};
