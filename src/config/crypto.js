const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; 
const key = crypto.randomBytes(32); 

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let result = cipher.update(text);
  result = Buffer.concat([result, cipher.final()]);
  return iv.toString('hex') + ':' + result.toString('hex');
}

function decrypt(encryptedText) {
  const parts = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, parts[0]);
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}



module.exports = { encrypt, decrypt };