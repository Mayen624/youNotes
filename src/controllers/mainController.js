const indexController = require('./auth.controller');
const signupController = require('./signUp.controller');
const notesController = require('./notes.controller');
const profileControler = require('./profile.controller');


const mainController = {
    indexController, 
    signupController,
    notesController,
    profileControler
}

exports.mainController = mainController;