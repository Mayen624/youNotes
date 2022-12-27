const indexController = require('./auth.controller');
const signupController = require('./signUp.controller');
const notesController = require('./notes.controller');


const mainController = {
    indexController, 
    signupController,
    notesController
}

exports.mainController = mainController;