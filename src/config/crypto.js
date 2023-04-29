const crypto = require('crypto');
const ALGORITMO = 'aes-256-cbc';

function encrypt(texto, key) {
  const iv = crypto.randomBytes(16);
  const cifrador = crypto.createCipheriv(ALGORITMO, Buffer.from(key), iv);
  let textoCifrado = cifrador.update(texto, 'utf8', 'hex');
  textoCifrado += cifrador.final('hex');
  return `${iv.toString('hex')}:${textoCifrado}:${key.toString('hex')}`;
}

function decrypt(textoCifrado) {

  const [ivHex, textoCifradoHex, claveHex] = textoCifrado.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(claveHex, 'hex');
  const descifrador = crypto.createDecipheriv(ALGORITMO, Buffer.from(key), iv);

  try {

    let textoDescifrado = descifrador.update(textoCifradoHex, 'hex', 'utf8');
    textoDescifrado += descifrador.final('utf8');
    return textoDescifrado;

  } catch (e) {

    if (e.code === 'ERR_OSSL_BAD_DECRYPT') {
      console.log(e)
      throw new Error('Error al desencriptar, llave incorrecta');

    }

  }
}



module.exports = { encrypt, decrypt };