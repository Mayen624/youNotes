const passport = require('passport');
const noteshemma = require('../models/Notes');
const userShemma = require('../models/Users');
const { encrypt, decrypt } = require('../config/crypto');
const { transporter } = require('../config/nodemailer');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jws = require('jsonwebtoken');
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

    const userInfo = await userShemma.findOne({ email: email });

    if (!userInfo) {
        req.flash('error_msg', 'Este correo no esta registrado.');
        return res.redirect('/auth/forgot_password');
    }

    try {
        //Create and get the reset token
        const token = jws.sign({id: userInfo._id}, process.ENV.KEY);
        console.log(token)
        
        await transporter.sendMail({
            from: '"Forgot password - youNotes" <mayen624.dev@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "youNotes ✔", // Subject line
            html: `
                <h1>Español</h1>
                <b>Aviso:</b>
                <p>Este es un correo generado outomaticamente, porfavor no responder este correo. Si cree que este correo es un error favor de eliminarlo.</p>
                <br>
                <b>Para cambiar tu contraseña haga click en el siguiente link:</b>
                <a href="https://localhost:3000/auth/newPassword">Cambia tu contraseña aqui</a>
                <br>
                <br>
                <h1>English</h1>
                <b>Warning:</b>
                <p>This is a auto generated email, please don't reply to this email. If you think this email is a error please delete it.</p>
                <br>
                <b>To change you password make click in the following link:</b>
                <a href="https://localhost:3000/auth/newPassword">Change your password here</a>
            `
        });

        req.flash('success_msg', 'Revisa tu correo electronico, es posible que el correo este en la seccion de spam, trash o unwanted.');
        return res.redirect('/auth/forgot_password');
    } catch (e) {
        console.log(e)
    }
}

module.exports = { renderIndexForm, auth, renderForgotPassword, forgotPassword, logout }