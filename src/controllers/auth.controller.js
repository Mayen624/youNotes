const passport = require('passport');
const noteshemma = require('../models/Notes');
const userShemma = require('../models/Users');
const { encrypt, decrypt } = require('../config/crypto');
const { generateHash, compareHash } = require('../config/bycrypt');
const { transporter } = require('../config/nodemailer');
const dotenv = require('dotenv');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
dotenv.config();

const renderIndexForm = async (req, res) => {
    res.render('../views/index');
}

const auth = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/notes',
    badRequestMessage: 'Correo o contraseña incorrectos.',
    failureFlash: true
})

//Close the user's session
const logout = async (req, res) => {

    //Id del usuario que esta guardado en la sesion
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
        res.redirect("/");
    });

}

const renderForgotPassword = async (req, res) => {
    res.render('../views/partials/forgotPasswordForm');
}

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        req.flash('error_msg', 'Correo electronico requerido.');
        return res.redirect('/forgot_password');
    }

    const userInfo = await userShemma.findOne({ email: email });

    if (!userInfo) {
        req.flash('error_msg', 'Este correo no esta registrado.');
        return res.redirect('/forgot_password');
    }

    try {
        //Create and get the reset token
        const token = jwt.sign({id: userInfo._id},  process.env.KEY, { expiresIn: '600s' });
        await userShemma.updateOne({_id: userInfo._id, reset_token: token})
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
                <a href="http://localhost:3000/new_password/${token}">Cambia tu contraseña aqui</a>
                <br>
                <br>
                <h1>English</h1>
                <b>Warning:</b>
                <p>This is a auto generated email, please don't reply to this email. If you think this email is a error, please delete it.</p>
                <br>
                <b>To change you password make click in the following link:</b>
                <a href="http://localhost:3000/new_password/${token}">Change your password here</a>
            `
        });

        req.flash('success_msg', 'Revisa tu correo electronico, es posible que el correo este en la seccion de spam, trash o unwanted.');
        return res.redirect('/forgot_password');
    } catch (e) {
        console.log(e)
    }
}


const renderCreateNewPassword = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        req.flash('error_msg', '¡Falta el token!');
        return res.redirect('/forgot_password');
    }

    try {

        const decode = await jwt.verify(token, process.env.key);

        if(decode){
            res.render('../views/partials/changePasswordForm', {token});
        }else{
            throw new error('Some woring');
        }
        
    }catch (err) {
        console.log(err);
        if(err.message == 'jwt expired'){
            req.flash('error_msg', 'Token expirado.');
            return res.redirect('/forgot_password');
        }else if(err.message == 'invalid token'){
            req.flash('error_msg', 'Token no valido.');
            return res.redirect('/forgot_password');
        }
        req.flash('error_msg', err.message);
        return res.redirect('/forgot_password');
    }
};

const createNewPassword = async (req,res) => {
    const {token,password, confPass} = req.body;

    if(!token){
        req.flash('error_msg', '¡Falta el token!');
        return res.redirect('/new_password');
    }

    if(!password){
        req.flash('error_msg', 'Contraseña requerida!');
        return res.redirect('/new_password/'+token);
    }

    if(!confPass){
        req.flash('error_msg', 'Confirmar contraseña!');
        return res.redirect('/new_password/'+token);
    }

    if(password !== confPass){
        req.flash('error_msg', 'Las contraseñas no coinciden!');
        return res.redirect('/new_password/'+token);
    }

    try {
        const decode = jwt.verify(token, process.env.key);
        const salt = await bycrypt.genSalt(10);
        const passwordHashed = await bycrypt.hash(password, salt);
        await userShemma.updateOne({_id: decode.id, password: passwordHashed});

        req.flash('success_msg', 'Tus credenciales fueron restablecidas exitosamente!');
        res.redirect('/');

    } catch (error) {
        console.log(error);
        req.flash('error_msg', error.message);
        return res.redirect('/new_password/'+token);
    }


}

const renderCreateNewKey = async (req, res) => {
    const token = req.token;
    res.render('../views/partials/changeSKey', {token});
}

const createNewKey = async (req, res) => {
    const {token, code, sKey, confSKey } = req.body;

    if(!token){
        req.flash('error_msg', 'Algo ha salido mal, intentalo de nuevo mas tarde.');
        return res.redirect('/');
    }

    if(!code || !sKey || !confSKey){
        req.flash('error_msg', 'Todos los campos son requeridos.');
        return res.redirect('/new_secret_Key?token=' + token);
    }

    if(sKey !== confSKey){
        req.flash('error_msg', 'Las llaves no coinciden!.');
        return res.redirect('/new_secret_Key?token=' + token);
    }

    try {

        const decode = jwt.verify(token, process.env.RESET_SKEY_SECRET);
        const user = await userShemma.findOne({_id: decode.id});

        if(user.code === code){
            
            const newKey = await generateHash(sKey);
            await userShemma.updateOne({_id: decode.id, key: newKey});
    
            req.logout((err) => {
                if (err) { return next(err); }
                req.flash('success_msg', 'Tu llave de seguridad fue restablecida exitosamente!');
                return res.redirect("/");
            });
        }else{
            req.flash('error_msg', 'Codigo de verificacion no valido!.');
            return res.redirect('/new_secret_Key?token=' + token);
        }
        
    } catch (e) {
        req.flash('error_msg', e.message);
        return res.redirect('/');
    }
    
}



module.exports = 
    { 
        renderIndexForm, auth, renderForgotPassword, 
        forgotPassword, renderCreateNewPassword,renderCreateNewKey, 
        createNewKey,createNewPassword, logout 
    }