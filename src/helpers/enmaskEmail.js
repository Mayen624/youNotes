function enmaskEmail(email){
    // Divide el correo en el nombre y el dominio
    const [nombre, dominio] = email.split('@');

    // Obtiene la longitud del nombre del correo
    const nombreLength = nombre.length;

    // Obtiene la cantidad de caracteres a mostrar al inicio (mínimo 3)
    const caracteresMostrados = Math.min(3, nombreLength);

    // Obtiene los caracteres iniciales del nombre
    const primerosCaracteres = nombre.substring(0, caracteresMostrados);

    // Oculta los caracteres restantes del nombre
    const caracteresRestantes = nombre.substring(caracteresMostrados);
    const maskedNombre = primerosCaracteres + '*'.repeat(caracteresRestantes.length);

    // Crea el correo enmascarado mostrando solo una parte y ocultando el resto
    return maskedEmailDisplay = maskedNombre + '@' + dominio;

    // Imprime el correo enmascarado
}

module.exports = {enmaskEmail};