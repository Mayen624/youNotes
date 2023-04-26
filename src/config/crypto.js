const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; //Algorithm for use
const key = crypto.randomBytes(32); // key - a buffer of bytes that is unique
const iv = crypto.randomBytes(16); // iv - another buffer of bytes that is unique

const encrypt = (sKey) => {

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const sKeyEncrypted = Buffer.concat([cipher.update(sKey), cipher.final()]);

    return encryptedResult = iv.toString("hex") + ':' + sKeyEncrypted.toString("hex")

}

const decrypt = (sKeyEncrypted) => {

    console.log(sKeyEncrypted)

    // const decryptedResult = sKeyEncrypted.trim().split(":");
    // const iv = Buffer.from(decryptedResult[0], "hex");
    // const encrypted = Buffer.from(decryptedResult[1], "hex");
    // const sKeyDecrypted = crypto.createDecipheriv(algorithm, key, iv);
    // crypto.concat([sKeyDecrypted.update(encrypted), sKeyDecrypted.final()]);

    // const ivBuffer = Buffer.from(sKeyEncrypted.iv, "hex");
    // const keyBuffer = Buffer.from(sKeyEncrypted.encrypted, "hex");
}


module.exports = { encrypt, decrypt };