const passport = require('passport');
const noteshemma = require('../models/Notes');
const userShemma = require('../models/Users');
const { encrypt, decrypt } = require('../config/crypto');
const { transporter } = require('../config/nodemailer');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
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

const renderForgotPassword = async (req, res) => {
    res.render('../views/partials/forgotPasswordForm');
}

const forgotPassword = async (req, res) => {
    // first step found the username of user
    // then create a token for save it in the user info
    // after that check for existing token in the user data
    // then

    const { email } = req.body;

    if (!email) {
        req.flash('error_msg', 'Correo electronico requerido.');
        return res.redirect('/auth/forgot_password');
    }

    const existingEmail = await userShemma.findOne({ email: email });

    if (!existingEmail) {
        req.flash('error_msg', 'Este correo no esta registrado.');
        return res.redirect('/auth/forgot_password');
    }

    try {
        await transporter.sendMail({
            from: '"Forgot password - youNotes" <mayen624.dev@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "you Notes ✔", // Subject line
            html: `
                <b>Please click in the following link to change your password:</b>
                <a href="localhost:3000/auth/newPassword">localhost:3000/auth/newPassword</a>
            `
        });

        res.json({
            status: 'ok',
            message: 'Please check your email'
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = { renderIndexForm, auth, renderForgotPassword, forgotPassword, logout }