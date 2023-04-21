const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const encrypt = (content, sKey) => {
    return noteContent = CryptoJS.AES.encrypt(JSON.stringify(content), sKey).toString();
}

const decrypt = (sKey, sKeyHashed, encryptedContent) => {

    const match = bcrypt.compare(sKey, sKeyHashed);

    if (match) {
        const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, sKeyHashed);
        return JSON.parse(decryptedContent.toString(CryptoJS.enc.Utf8));
    }

}

module.exports = { encrypt, decrypt };