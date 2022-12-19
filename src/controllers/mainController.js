const indexController = require('./auth.controller');
const signupController = require('./signUp.controller');


const mainController = {
    indexController, 
    signupController
}

exports.mainController = mainController;