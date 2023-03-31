const {Router} = require('express');
const main = require('../controllers/mainController');
const profileController = main.mainController.profileControler;
const {isAuthenticated} = require('../helpers/sessionAuth');
const router = Router();

router.get('/', isAuthenticated,profileController.profileRender);

module.exports = router;