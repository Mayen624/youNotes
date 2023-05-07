const bcrypt = require('bcrypt');

const generateHash = async (text) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(text, salts);
}

const compareHash = async (key, hashedKey) => {
    return await bcrypt.compare(key, hashedKey);
}

module.exports = { generateHash, compareHash }