const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; //Algorithm for use
const key = crypto.randomBytes(32); // key - a buffer of bytes that is unique
const iv = crypto.randomBytes(16); // iv - another buffer of bytes that is unique

function encrypt(sKey) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(sKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }
  
  function decrypt(sKeyEncrypted) {
    const parts = sKeyEncrypted.split(':');
    const sKeyDecrypted = crypto.createDecipheriv(algorithm, key, Buffer.from(parts[0], 'hex'));
    let decrypted = sKeyDecrypted.update(parts[1], 'hex', 'utf8');
    decrypted += sKeyDecrypted.final('utf8').toString();
    return decrypted;
  }
  


module.exports = { encrypt, decrypt };