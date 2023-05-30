const passport = require('passport');
const noteshemma = require('../models/Notes');
const userShemma = require('../models/Users');
const { encrypt, decrypt } = require('../config/crypto');
const { transporter } = require('../config/nodemailer');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
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
        const token = jws.sign({ id: userInfo._id, expireIn: '10m' }, process.env.KEY);
        await userShemma.updateOne({ _id: userInfo._id, reset_token: token });
        console.log(token)

        await transporter.sendMail({
            from: '"Forgot password - youNotes" <mayen624.dev@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "youNotes ✔", // Subject line
            html: `
                <h1>Español</h1>
                <b>Aviso:</b>
                <p>Este es un correo generado outomaticamente, porfavor no responder este correo. Si cree que este correo es un error, favor de eliminarlo.</p>
                <br>
                <b>Para cambiar tu contraseña haga click en el siguiente link:</b>
                <a href="http://localhost:3000/auth/new_password/${token}">Cambia tu contraseña aqui</a>
                <br>
                <br>
                <h1>English</h1>
                <b>Warning:</b>
                <p>This is a auto generated email, please don't reply to this email. If you think this email is a error, please delete it.</p>
                <br>
                <b>To change you password make click in the following link:</b>
                <a href="http://localhost:3000/auth/new_password/${token}">Change your password here</a>
            `
        });

        req.flash('success_msg', 'Revisa tu correo electronico, es posible que el correo este en la seccion de spam, trash o unwanted.');
        return res.redirect('/auth/forgot_password');
    } catch (e) {
        console.log(e)
    }
}


const createNewPassword = async (req, res) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const { token } = req.params;

    if (!token) {
        req.flash('error_msg', '¡Falta el token!');
        return res.redirect('/auth/forgot_password');
    }

    try {
        const decoded = jwt.verify(token, process.env.key);

        res.render('../views/partials/changePasswordForm');

        
    } catch (err) {
        console.log(err);
        req.flash('error_msg', err.message);
        return res.redirect('/auth/forgot_password');
    }
};

module.exports = { renderIndexForm, auth, renderForgotPassword, forgotPassword, createNewPassword, logout }