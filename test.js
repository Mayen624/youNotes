const crypto = require('crypto');
const ALGORITMO = 'aes-256-cbc';
const CLAVE = crypto.randomBytes(32);

// function encriptar(texto, key) {
//   const iv = crypto.randomBytes(16);
//   const cifrador = crypto.createCipheriv(ALGORITMO, Buffer.from(key), iv);
//   let textoCifrado = cifrador.update(texto, 'utf8', 'hex');
//   textoCifrado += cifrador.final('hex');
//   return `${iv.toString('hex')}:${textoCifrado}:${key.toString('hex')}`;
// }

// function desencriptar(textoCifrado) {
//   const [ivHex, textoCifradoHex, claveHex] = textoCifrado.split(':');
//   const iv = Buffer.from(ivHex, 'hex');
//   const clave = Buffer.from(claveHex, 'hex');
//   const descifrador = crypto.createDecipheriv(ALGORITMO, clave, iv);
//   let textoDescifrado = descifrador.update(textoCifradoHex, 'hex', 'utf8');
//   textoDescifrado += descifrador.final('utf8');
//   return textoDescifrado;
// }

// let orgText = 'hola mundo!';
// let textEncrypted = encriptar(orgText, CLAVE);
// let textDecrypted = desencriptar(textEncrypted);

// console.log(orgText);
// console.log(textEncrypted);
// console.log(textDecrypted);

const clave = 'mySecretKey';
const key = Buffer.from(clave, 'utf8').slice(0, 32);
console.log(key)
