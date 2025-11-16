// backend/services/encryptionService.js
const crypto = require("crypto");

const LOCAL_MASTER_KEY = process.env.LOCAL_MASTER_KEY;

if (!LOCAL_MASTER_KEY) {
  throw new Error("LOCAL_MASTER_KEY missing in .env");
}

const MASTER_KEY = Buffer.from(LOCAL_MASTER_KEY, "base64");

// Encrypt plaintext using AES-256-GCM
exports.encryptSecret = async (plaintext) => {
  const iv = crypto.randomBytes(12);        // recommended length
  const key = MASTER_KEY;

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return {
    algorithm: "AES-256-GCM",
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    createdAt: new Date()
  };
};

// Decrypt AES-256-GCM
exports.decryptSecret = async (stored) => {
  const key = MASTER_KEY;
  const iv = Buffer.from(stored.iv, "base64");
  const authTag = Buffer.from(stored.authTag, "base64");
  const ciphertext = Buffer.from(stored.ciphertext, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};
