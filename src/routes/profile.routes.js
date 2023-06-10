const {Router} = require('express');
const main = require('../controllers/mainController');
const profileController = main.mainController.profileControler;
const {isAuthenticated} = require('../middlewares/sessionAuth');
const router = Router();

router.get('/', isAuthenticated,profileController.profileRender);

router.post('/edit', isAuthenticated, profileController.editProfile);

router.post('/secretKey', isAuthenticated, profileController.addSecretKey);

router.get('/forgotKey', isAuthenticated, profileController.renderForgotSecretKey);

router.post('/forgotKey', isAuthenticated, profileController.forgotSecretKey);

module.exports = router;