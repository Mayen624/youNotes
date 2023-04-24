const bycrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
const {encrypt} = require('../config/crypto');
const noteshemma = require('../models/Notes');

const renderIndexForm = async (req,res) => {
    res.render('../views/index');
}

const auth = passport.authenticate('local', {
    failureRedirect: '/auth',
    successRedirect: '/notes',
    badRequestMessage:'Correo o contraseña incorrectos.',
    failureFlash: true
})

//Close the user's session
const logout = async (req,res) => {

    // const userData = req.user;

    // const notesToUpdate = await noteshemma.updateMany({categoria: 'CREDENCIALES', isEncrypted: false, id_user: mongoose.Types.ObjectId(userData._id)}, {isEncrypted: true, contenido: userData.key})
    // res.json(notesToUpdate);

    req.logout( (err) => {
        if (err) { return next(err); }
        req.flash( "success_msg" , "Sesión cerrada." );
        res.redirect("/auth");
    });

}

module.exports = {renderIndexForm, auth, logout}