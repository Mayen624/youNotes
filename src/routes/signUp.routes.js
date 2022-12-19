const {Router} = require('express');
const main = require('../controllers/mainController');
const signUpController = main.mainController.signupController;
const router = Router();

//Main route - signUp to the system
router.get('/', signUpController.signupRenderForm);

router.post('/', signUpController.addUser);

module.exports = router;