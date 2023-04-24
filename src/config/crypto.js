const CryptoJS = require('crypto-js');

const encrypt = (content, sKey) => {
    return noteContent = CryptoJS.AES.encrypt(JSON.stringify(content), sKey).toString();
}

const decrypt = (sKey, sKeyEncrypted, encryptedContent) => {

    const skBytes = CryptoJS.AES.decrypt(sKeyEncrypted, sKey);
    const sKeyDecrypted = JSON.parse(skBytes.toString(CryptoJS.enc.Utf8));

    console.log(sKeyDecrypted)

    try {
        const contentBytes = CryptoJS.AES.decrypt(encryptedContent, sKeyDecrypted);
        console.log(contentBytes)
        return JSON.parse(contentBytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        console.log(e)
    }

}

module.exports = { encrypt, decrypt };