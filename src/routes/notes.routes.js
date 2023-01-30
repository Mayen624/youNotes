const {Router} = require('express');
const main = require('../controllers/mainController');
const notesController = main.mainController.notesController;
const routes = Router();

routes.get('/', notesController.notesRender);

routes.get('/logout', notesController.logout);

module.exports = routes;