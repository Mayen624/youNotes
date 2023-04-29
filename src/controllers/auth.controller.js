const crypto = require('crypto');
const mongoose = require('mongoose');
const passport = require('passport');
const noteshemma = require('../models/Notes');
const { encrypt, decrypt } = require('../config/crypto');

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

    const userData = req.user;
    const notesToUpdate = await noteshemma.updateMany(
        { categoria: "CREDENCIALES", isEncrypted: false, id_user: mongoose.Types.ObjectId(userData._id), "contenido": { $type: "array" } },
        { $set: { "contenido.$[].text": encryptedContents, isEncrypted: true } },
        { arrayFilters: [{ "note.isEncrypted": false }]}
      );
      
      res.json(notesToUpdate);

    // const notesToUpdate = await noteshemma.updateMany({categoria: 'CREDENCIALES', isEncrypted: false, id_user: mongoose.Types.ObjectId(userData._id)}, {isEncrypted: true, contenido: encrypt(notes.contenido, crypto.randomBytes(32))})
    // res.json(notesToUpdate);

    // req.logout( (err) => {
    //     if (err) { return next(err); }
    //     req.flash( "success_msg" , "Sesión cerrada." );
    //     res.redirect("/auth");
    // });

}

module.exports = {renderIndexForm, auth, logout}