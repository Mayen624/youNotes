const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const encrypt = (content, sKey) => {
    return noteContent =  CryptoJS.AES.encrypt(content, sKey);   
}

const decrypt = (content, sKey) => {
    return decryptedText = CryptoJS.AES.decrypt(content, sKey).toString(CryptoJS.enc.Utf8);
}

module.exports = {encrypt, decrypt};