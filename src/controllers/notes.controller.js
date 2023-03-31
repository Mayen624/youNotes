const {format} = require('date-fns');
const noteshemma = require('../models/Notes');
const bcrypt = require('bcrypt');
const categoryShemma = require('../models/Categories');

let currentDate = new Date(); //Current date

const notesRender = async (req,res) => {
    
    let filter = {};
    const {filtro} = req.query; // Filter all notes by user id or category
    const userInfo = req.user; //All the data about user.
    
    if(filtro){
        const upperCaseFilter = filtro.toUpperCase();
        filter = { id_user: userInfo._id, categoria: upperCaseFilter };
    }else{
        filter = { id_user: userInfo._id };
    }

    const notes = await noteshemma.find(filter); //Notes of user
    res.render('../views/layouts/notes', {layout: 'notes.hbs', notes, userName: userInfo.user});
}


const addNote = async (req,res) => {

    const {tittle, category, content} = req.body;
    const allowedCategories = ['Recordatorio', 'Negocios', 'Credenciales', 'Trabajo'];
    const error = [];

    if(tittle == "" || category == "" || content == ""){
        error.push('Todos los datos son requeridos.')
    }

    if(!allowedCategories.includes(category)){
        error.push('Categoria no permitida.')
    }

    if(error.length > 0){
        res.render('../views/layouts/notes', {layout: 'notes.hbs', error});
    }else{
        
        // if(category == 'recordatorio' || category == 'Recordatorio'){
        //     const newNote = new noteshemma({
        //         id_user: req.user._id,
        //         titulo: tittle,
        //         categoria: category.toUpperCase(),
        //         contenido: bcrypt.hash(content, 10),
        //         createdAt: format(currentDate, 'dd/MM/yyyy'),
        //         updatedAt: format(currentDate, 'dd/MM/yyyy')
        //     })

        //     await newNote.save();
        //     req.flash("success_msg", "Nueva nota añadida.");
        //     res.redirect('/notes');

        // }else{
        //     const newNote = new noteshemma({
        //         id_user: req.user._id,
        //         titulo: tittle,
        //         categoria: category.toUpperCase(),
        //         contenido: content,
        //         createdAt: format(currentDate, 'dd/MM/yyyy'),
        //         updatedAt: format(currentDate, 'dd/MM/yyyy')
        //     })

        //     await newNote.save();
        //     req.flash("success_msg", "Nueva nota añadida.");
        //     res.redirect('/notes');
        // }

        const newNote = new noteshemma({
            id_user: req.user._id,
            titulo: tittle,
            categoria: category.toUpperCase(),
            contenido: content,
            createdAt: format(currentDate, 'dd/MM/yyyy'),
            updatedAt: format(currentDate, 'dd/MM/yyyy')
        })

        await newNote.save();
        req.flash("success_msg", "Nueva nota añadida.");
        res.redirect('/notes');
    }
}

const editNotesForm = async (req,res) => {
    const userInfo = req.user; //All the data about user
    const noteData = await noteshemma.findById(req.params.id);
    res.render('../views/partials/editNotesForm', {layout: 'edit.hbs', noteData, userName: userInfo.user})
}

const editNotes = async (req,res) => {
    const {id, tittle, category, content, updatedAt} = req.body;

    const noteData = await noteshemma.findById(id);
    const newNoteInfo = {tittle: tittle, category: category, content: content} //The note data passed by formulary
    const currentNoteInfo = {tittle: noteData.titulo, category: noteData.categoria, content: noteData.contenido} //The current note data of user

    const errors = [];

    if(id == "" || tittle == "" || category == "" || content == "" || updatedAt == ""){
        errors.push('Todos los campos son obligatorios.');
    }

    if(newNoteInfo.tittle === currentNoteInfo.tittle && newNoteInfo.category === currentNoteInfo.category && newNoteInfo.content === currentNoteInfo.content){
        errors.push('Los datos no pueden ser los mismos.');
    }

    if(errors.length > 0){
        const userInfo = req.user; //All the data about user
        res.render('../views/partials/editNotesForm', {layout: 'edit.hbs', noteData, userName: userInfo.user, errors})
    }else{
        await noteshemma.findByIdAndUpdate(id,{titulo: tittle, categoria: category.toUpperCase(), contenido: content, updatedAt: format(currentDate, 'dd/MM/yyyy')})
        req.flash('success_msg', 'Nota actualizada.')
        res.redirect('/notes');
    }

}
    

const deleteNotes = async (req,res) => {
    const {} = req.body;
}

const logout = async (req,res) => {
    req.logout();
    req.flash('success_msg', 'sesion cerada.');
    res.redirect('/auth');
}


module.exports = {notesRender, logout, addNote, editNotesForm, editNotes, deleteNotes}