const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(sKey) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(sKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log(encrypted.toString("hex"))
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(sKeyEncrypted) {
  const parts = sKeyEncrypted.split(':');
  const sKeyDecrypted = crypto.createDecipheriv(algorithm, key, Buffer.from(parts[0], 'hex'));
  let decrypted = sKeyDecrypted.update(parts[1], 'hex', 'utf8');
  console.log(decrypted.toString("hex"))
  decrypted += sKeyDecrypted.final('utf8').toString();
  return decrypted;
}

// Ejemplo de uso
const originalText = 'c40adm1080';
const encryptedText = encrypt(originalText);
const decryptedText = decrypt(encryptedText);
console.log(decryptedText)
// console.log(`Texto original: ${originalText}`);
// console.log(`Texto cifrado: ${encryptedText}`);
// console.log('Texto de la db:' + 'a1b24f390a5642616060365202a1ede9:11bcfb44883282fd3ca8f8a928553b4f')
// console.log(`Texto descifrado: ${decryptedText}`);





