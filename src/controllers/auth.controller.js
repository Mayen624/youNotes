const passport = require('passport');
const noteshemma = require('../models/Notes');
const userShemma = require('../models/Users');
const { encrypt, decrypt } = require('../config/crypto');
const dotenv = require('dotenv');
dotenv.config()

const renderIndexForm = async (req, res) => {
    res.render('../views/index');
}

const auth = passport.authenticate('local', {
    failureRedirect: '/auth',
    successRedirect: '/notes',
    badRequestMessage: 'Correo o contraseña incorrectos.',
    failureFlash: true
})

//Close the user's session
const logout = async (req, res) => {

    const userData = req.user;
    const idUser = userData._id;

    try {
        // Buscamos todas las notas del usuario que estén desencriptadas
        const unencryptedNotes = await noteshemma.find({ idUser, isEncrypted: false, categoria: 'CREDENCIALES' });
        // Iteramos sobre cada nota desencriptada
        for (let nota of unencryptedNotes) {
            // Encriptamos el contenido de la nota
            const encryptedContent = encrypt(nota.contenido, process.env.KEY);
            // Actualizamos la nota con el contenido encriptado
            await noteshemma.updateMany({ _id: nota._id }, { contenido: encryptedContent, isEncrypted: true });
        }

    } catch (error) {
        console.error('Error al actualizar las notas encriptadas', error);
    }

    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success_msg", "Sesión cerrada.");
        res.redirect("/auth");
    });

}

const renderForgotPassword = async (req,res) => {    
    res.render('../views/partials/forgotPasswordForm');
}

const newPassword = async (req,res) => {
    // first step found the username of user
    // then create a token for save it in the user info
    // after that check for existing token in the user data
    // then

    const {email} = req.body;

    if(!email){
        req.flash('error_msg', 'Correo electronico requerido.');
        return res.redirect('/auth/forgot_password');
    }

    const existingEmail = await userShemma.findOne({email: email});

    if(!existingEmail){
        req.flash('error_msg', 'Este correo no esta registrado.');
        return res.redirect('/auth/forgot_password');
    }

    console.log(existingEmail)
}

module.exports = { renderIndexForm, auth, renderForgotPassword, newPassword, logout }