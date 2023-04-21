const { Router } = require('express');
const main = require('../controllers/mainController');
const notesController = main.mainController.notesController;
const { isAuthenticated } = require('../helpers/sessionAuth');
const router = Router();

router.get('/', isAuthenticated, notesController.notesRender);

router.post('/add', isAuthenticated, notesController.addNote);

router.get('/edit/:id', isAuthenticated, notesController.editNotesForm);

router.post('/edit', isAuthenticated, notesController.editNotes)

router.get('/delete', isAuthenticated, notesController.deleteNotes);

router.post('/decryptNote', isAuthenticated, notesController.decryptNote);

router.get('/logout', notesController.logout);

module.exports = router;