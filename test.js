const crypto = require('crypto');
const ALGORITMO = 'aes-256-cbc';
const CLAVE = crypto.randomBytes(32);

function encriptar(texto) {
  const iv = crypto.randomBytes(16);
  const cifrador = crypto.createCipheriv(ALGORITMO, Buffer.from(CLAVE), iv);
  let textoCifrado = cifrador.update(texto, 'utf8', 'hex');
  textoCifrado += cifrador.final('hex');
  return `${iv.toString('hex')}:${textoCifrado}`;
}

function desencriptar(textoCifrado) {
  const [ivHex, textoCifradoHex] = textoCifrado.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const descifrador = crypto.createDecipheriv(ALGORITMO, Buffer.from(CLAVE), iv);
  let textoDescifrado = descifrador.update(textoCifradoHex, 'hex', 'utf8');
  textoDescifrado += descifrador.final('utf8');
  return textoDescifrado;
}

let orgText = 'hola mundo!';
let textEncrypted = encriptar(orgText);
let textDecrypted = desencriptar(textEncrypted);

console.log(orgText)
console.log(textEncrypted)
console.log(textDecrypted)