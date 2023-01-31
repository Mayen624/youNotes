const  {Router} = require('express');
const main = require('../controllers/mainController.js');
const indexController = main.mainController.indexController;
const router = Router();


//Main route - login
router.get('/', indexController.renderIndexForm);

//User Auth
router.post('/', indexController.auth);

router.get('/logout', indexController.logout);

module.exports = router;