const {Router} = require('express');
const main = require('../controllers/mainController');
const notesController = main.mainController.notesController;
const {isAuthenticated} = require('../helpers/sessionAuth');
const routes = Router();

routes.get('/',isAuthenticated, notesController.notesRender);

routes.post('/add', isAuthenticated, notesController.addNote);

routes.get('/logout', notesController.logout);

module.exports = routes;