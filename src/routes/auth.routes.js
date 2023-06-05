const  {Router} = require('express');
const main = require('../controllers/mainController.js');
const indexController = main.mainController.indexController;
const {validateToken} = require('../middlewares/isAutorizate');
const router = Router();


//Main route - login
router.get('/', indexController.renderIndexForm);

//User Auth
router.post('/', indexController.auth);

//Log out the user from the system
router.get('/logout', indexController.logout);

router.get('/forgot_password', indexController.renderForgotPassword);

router.post('/forgot_password', indexController.forgotPassword);

router.get('/new_password/:token', indexController.renderCreateNewPassword);

router.post('/new_password', indexController.createNewPassword);

router.get('/new_secret_Key', validateToken , indexController.renderCreateNewKey);

router.post('/new_secret_Key', indexController.createNewKey);

module.exports = router;