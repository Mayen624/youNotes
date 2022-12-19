const  {Router} = require('express');
const main = require('../controllers/mainController.js');
const indexController = main.mainController.indexController;
const router = Router();


//Main route - login
router.get('/', indexController.renderIndexForm);

//User Auth
router.post('/', indexController.auth);

//req post - login

module.exports = router;