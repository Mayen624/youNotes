const { generateHash, compareHash } = require('../config/bycrypt');
const crypto = require('crypto');
const ALGORITMO = 'aes-256-cbc';

const encrypt = (texto, key) => {
  const iv = crypto.randomBytes(16);
  const rKey = Buffer.alloc(32, key);
  const cifrador = crypto.createCipheriv(ALGORITMO, rKey, iv);
  let textoCifrado = cifrador.update(texto, 'utf8', 'hex');
  textoCifrado += cifrador.final('hex');
  return `${iv.toString('hex')}:${textoCifrado}:${rKey.toString('hex')}`;
}


const decrypt = async (textoCifrado, passedKey, hashedKey) => {
  const [ivHex, textoCifradoHex, sKeyHex] = textoCifrado.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const sKey = Buffer.from(sKeyHex, 'hex')
  const match = await compareHash(passedKey, hashedKey);

  if (match) {
    const descifrador = crypto.createDecipheriv(ALGORITMO, Buffer.from(sKey), iv);
    let textoDescifrado = descifrador.update(textoCifradoHex, 'hex', 'utf8');
    textoDescifrado += descifrador.final('utf8');
    return textoDescifrado;
  } else {
    throw new Error('Llave incorrecta, intentelo de nuevo.')
  }


}

const createBUffer = (text) => {
  return Buffer.alloc(32, text)
}



module.exports = { encrypt, decrypt, createBUffer };