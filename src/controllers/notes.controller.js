const crypto = require('crypto');
const { format } = require('date-fns');
const noteshemma = require('../models/Notes');
const categoryShemma = require('../models/Categories');
const { encrypt, decrypt } = require('../config/crypto');

let currentDate = new Date(); //Current date

const notesRender = async (req, res) => {

    let filter = {};
    const { filtro } = req.query; // Filter all notes by user id or category
    const userInfo = req.user; //All the data about user.

    if (filtro) {
        const upperCaseFilter = filtro.toUpperCase();
        filter = { id_user: userInfo._id, categoria: upperCaseFilter };
    } else {
        filter = { id_user: userInfo._id };
    }

    const notes = await noteshemma.find(filter); //Notes of user
    res.render('../views/layouts/notes', { layout: 'notes.hbs', notes, userName: userInfo.user, userInfo });
}


const addNote = async (req, res) => {

    const { tittle, category, content } = req.body;

    const userData = req.user;
    const allowedCategories = ['Recordatorio', 'Negocios', 'Credenciales', 'Trabajo'];
    const formattedCategory = category.toUpperCase();

    if (tittle == "" || category == "" || content == "") {
        req.flash('error_msg', ' Todos los datos son requeridos.');
        return res.redirect('/notes');
    }

    if (!allowedCategories.includes(category)) {
        req.flash('error_msg', ' Categoria no permitida.');
        return res.redirect('/notes');
    }

    //ENCRYPT CONTENT IF CATEGORY IS CREDENTIALS AND KEY ISN'T NULL

    if (formattedCategory == 'CREDENCIALES') {

        if (userData.key !== null) {
            try {
                const newNote = new noteshemma({
                    id_user: req.user._id,
                    titulo: tittle,
                    categoria: formattedCategory,
                    contenido: encrypt(content, crypto.randomBytes(32)),
                    createdAt: format(currentDate, 'dd/MM/yyyy'),
                    updatedAt: format(currentDate, 'dd/MM/yyyy'),
                    isEncrypted: true
                })

                await newNote.save();
                req.flash("success_msg", "Nueva nota añadida.");
                return res.redirect('/notes');
            } catch (e) {
                console.log(e)
            }
        } else {
            req.flash('error_msg', ' Debes crear una llave de seguridad para poder crear notas de tipo "credenciales". Puedes crearla en la configuracion de tu perfil.');
            return res.redirect('/notes');
        }
    }

    try {
        const newNote = new noteshemma({
            id_user: req.user._id,
            titulo: tittle,
            categoria: formattedCategory,
            contenido: content,
            createdAt: format(currentDate, 'dd/MM/yyyy'),
            updatedAt: format(currentDate, 'dd/MM/yyyy')
        })

        await newNote.save();
        req.flash("success_msg", "Nueva nota añadida.");
        return res.redirect('/notes');
    } catch (e) {
        console.log(e)
    }

}

const editNotesForm = async (req, res) => {
    const userInfo = req.user; //All the data about user
    const noteData = await noteshemma.findById(req.params.id);
    res.render('../views/partials/editNotesForm', { layout: 'edit.hbs', noteData, userName: userInfo.user })
}

const editNotes = async (req, res) => {
    const { id, tittle, category, content, updatedAt } = req.body;

    const userData = req.user;
    const noteData = await noteshemma.findById(id);
    const formattedCategory = category.toUpperCase();
    const newNoteInfo = { tittle: tittle, category: category, content: content } //The note data passed by formulary
    const currentNoteInfo = { tittle: noteData.titulo, category: noteData.categoria, content: noteData.contenido } //The current note data of user

    const errors = [];

    if (id == "" || tittle == "" || category == "" || content == "" || updatedAt == "") {
        errors.push('Todos los campos son obligatorios.');
    }

    if (newNoteInfo.tittle === currentNoteInfo.tittle && newNoteInfo.category === currentNoteInfo.category && newNoteInfo.content === currentNoteInfo.content) {
        errors.push('Los datos no pueden ser los mismos.');
    }

    if (userData.key === null && formattedCategory == 'CREDENCIALES') {
        errors.push('Debes crear una llave de seguridad para poder crear notas de tipo "credenciales". Puedes crearla en la configuracion de tu perfil.');
    }

    if (errors.length > 0) {
        const userInfo = req.user; //All the data about user
        res.render('../views/partials/editNotesForm', { layout: 'edit.hbs', noteData, userName: userInfo.user, errors })
    } else {
        await noteshemma.findByIdAndUpdate(id, { titulo: tittle, categoria: formattedCategory, contenido: content, updatedAt: format(currentDate, 'dd/MM/yyyy') })
        req.flash('success_msg', 'Nota actualizada.')
        res.redirect('/notes');
    }

}


const deleteNotes = async (req, res) => {
    const { id } = req.query

    if (id) {
        await noteshemma.deleteOne({ _id: id });
        res.json({ warning_msg: 'Nota eleminada.' }).status(200);
    } else {
        req.flash('error_msg', 'Ha ocurrido un error indesperad, si el problema persiste intentelo mas tarde.');
        res.redirect('/notes');
    }
}


const decryptNote = async (req, res) => {
    const userData = req.user;
    const { id, sKey } = req.body;

    if (!sKey) {
        req.flash('error_msg', 'Llave faltante.');
        return res.redirect('/notes');
    }

    if (!id) {
        req.flash('error_msg', 'Ha ocurrido un error inesperado!, si el problema persiste preuba intentarlo mas tarde.');
        return res.redirect('/notes');
    }

    const note = await noteshemma.findOne({ _id: id });

    try {
        const decryptedContent = decrypt(note.contenido);
        await noteshemma.findByIdAndUpdate(id, { contenido: decryptedContent, isEncrypted: false });
        req.flash('success_msg', 'Nota desencriptada exitosamente.');
        return res.redirect('/notes');
    } catch (e) {
        console.log(e)
        req.flash('error_msg', e.message);
        res.redirect('/notes')
    }
}

const logout = async (req, res) => {
    req.logout();
}


module.exports = { notesRender, logout, addNote, editNotesForm, editNotes, deleteNotes, decryptNote }