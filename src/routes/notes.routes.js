const {Router} = require('express');
const main = require('../controllers/mainController');
const notesController = main.mainController.notesController;
const routes = Router();

routes.get('/', notesController.notesRender);

module.exports = routes;