const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const key = process.env.KEY;
const iv = process.env.IV;

async function encrypt(text) {
  try {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  } catch {
    //console.log("Encryption Error");
    return;
  }
}

async function decrypt(text) {
  try {
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch {
    //console.log("Decryption Error");
    return 0;
  }
}

module.exports = { encrypt, decrypt };
