const { generateHash, compareHash } = require('../config/bycrypt');
const { transporter } = require('../config/nodemailer');
const userShemma = require('../models/Users');
const calculateAge = require('../helpers/calculateAge');
const { format } = require('date-fns');
const {enmaskEmail} = require('../helpers/enmaskEmail');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const speakeasy = require('speakeasy');
dotenv.config()

const profileRender = async (req, res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', { layout: 'profile.hbs', userName: userInfo.user, userInfo, dateJoin: format(userInfo.createdAt, 'dd/MM/yyyy'), })
}

const editProfile = async (req, res) => {

    //console.log(req.file);

    const userData = req.user;
    const { id, names, work, sex, age } = req.body;
    const formattedAge = calculateAge(age);

    if (!id || !names || !work || !sex || !age) {
        req.flash('error_msg', 'Todos los campos son requeridos.');
        return res.redirect('/profile');
    }

    if (formattedAge <= 8) {
        req.flash('error_msg', 'Debes ser mayor a 8 años.');
        return res.redirect('/profile');
    }

    if (names === userData.names && work === userData.work && sex === userData.sex && formattedAge == userData.age) {
        req.flash('error_msg', 'Los datos no pueden ser los mismos.');
        return res.redirect('/profile');
    }

    try {
        if (req.uploadError) {
            req.flash('error_msg', req.uploadError.message);
            return res.redirect('/profile');
        } else {
            await userShemma.findByIdAndUpdate(
                id,
                {
                    names: names, work: work, sex: sex, age: formattedAge,
                    image: {
                        name: req.file == undefined || null ? 'User.jpg' : req.file.filename,
                        orgName: req.file == undefined || null ? 'User.jpg' : req.file.originalname,
                        size: req.file == undefined || null ? 7023 : req.file.size
                    }
                }

            );
            req.flash('success_msg', 'Tus datos han sido actualizados.');
            return res.redirect('/profile');
        }
    } catch (e) {
        console.log(e)
    }

}

const addSecretKey = async (req, res) => {
    const { sKey } = req.body;
    const userData = req.user;

    if (!sKey) {
        req.flash('error_msg', 'Llave requrida!, tu llave te ayudara a proteger tus notas mas importantes y poder crear notas de categoria recordatorio.');
        res.redirect('/profile');
    } else {
        try {
            const hashedKey = await generateHash(sKey);
            await userShemma.findByIdAndUpdate(userData._id, { key: hashedKey });
            req.flash('success_msg', 'Tu llave fue existosamente creada, ahora puedes crear notas de categoria "credenciales".');
            res.redirect('/profile');
        } catch (e) {
            return console.log(e)
        }
    }
}

const renderForgotSecretKey = async (req, res) => {
    res.render('../views/partials/forgotKeyForm');
}

const forgotSecretKey = async (req, res) => {
    const { password } = req.body;
    const userData = req.user;

    if (!password) {
        req.flash('error_msg', 'Contraseña requerida');
        return res.redirect('/profile/forgotKey');
    }

    const user = await userShemma.findOne({ _id: userData._id });
    const match = await compareHash(password, user.password);

    if (!match) {
        req.flash('error_msg', 'La contraseña es incorrecta, intentelo de nuevo.');
        return res.redirect('/profile/forgotKey');
    }

    try {
        // Configura la clave secreta
        const secret = process.env.OTP_SECRET_KEY; 
        // Tiempo de vida del codigo OTP
        const codeValidity = 600;
        // Genera un código OTP
        const otpCode = speakeasy.totp({secret, window: codeValidity});
        // Enmascara el correo del usuario
        const enmaskedEmail = enmaskEmail(user.email);
        const token = jwt.sign({id: user._id},  process.env.RESET_SKEY_SECRET, { expiresIn: '600s' });

        await transporter.sendMail({
            from: '"Forgot secret key - youNotes" <mayen624.dev@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "youNotes ✔", // Subject line
            html: `
                <h1>Español</h1>
                <b>Aviso:</b>
                <p>Este es un correo generado outomaticamente, porfavor no responder este correo. Si cree que este correo es un error, favor de eliminarlo.</p>
                <br>
                <b>Para cambiar tu llave de seguridad haga click en el siguiente link:</b>
                <a href="http://localhost:3000/auth/new_secret_Key?token=${token}">Cambia tu contraseña aqui</a>
                <b>Tu codigo de verificacion:</b>
                <p>${otpCode}</p>
                <br>
                <br>
                <h1>English</h1>
                <b>Warning:</b>
                <p>This is a auto generated email, please don't reply to this email. If you think this email is a error, please delete it.</p>
                <br>
                <b>To change you security key make click in the following link:</b>
                <a href="http://localhost:3000/auth/new_secret_Key?token=${token}">Change your password here</a>
                <b>Your verification code:</b>
                <p>${otpCode}</p>
            `
        });

        req.flash('success_msg', 'Tu codigo codigo de verificacion fue enviado a tu correo: ' + enmaskedEmail);
        return res.redirect('/profile/forgotKey');
    } catch (e) {
        console.log(e);
    }


}

module.exports = {
    profileRender, editProfile, addSecretKey,
    renderForgotSecretKey, forgotSecretKey,
}