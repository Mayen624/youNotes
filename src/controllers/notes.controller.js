const {format} = require('date-fns');
const noteshemma = require('../models/Notes');
const categoryShemma = require('../models/Categories');

let currentDate = new Date(); //Current date

const notesRender = async (req,res) => {
    
    let filter = {};
    const {filtro} = req.query; // Filter all notes by user id or id category
    const userInfo = req.user; //All the data about user
    
    if(filtro){
        filter = { id_user: userInfo._id, categoria: filtro };
    }else{
        filter = { id_user: userInfo._id };
    }

    const notes = await noteshemma.find(filter); //Notes of user
    res.render('../views/layouts/notes', {layout: 'notes.hbs', notes, userName: userInfo.user});
}


const addNote = async (req,res) => {

    const {tittle, category, content} = req.body;
    const error = [];

    if(tittle == "" || category == "" || content == ""){
        error.push('Todos los datos son requeridos.')
    }

    if(error.length > 0){
        res.render('../views/layouts/notes', {layout: 'notes.hbs', error});
    }else{
        //it have to save the id, tittle etc...
        try {

            const newNote = new noteshemma({
                id_user: req.user._id,
                titulo: tittle,
                categoria: category,
                contenido: content,
                createdAt: format(currentDate, 'dd/MM/yyyy'),
                updatedAt: format(currentDate, 'dd/MM/yyyy')
            })
    
            await newNote.save();
            req.flash("success_msg", "Nueva nota añadida.");
            res.redirect('/notes');

        } catch (e) {
            req.flash("error_msg", "Ha ocurrido un error inesperado, porfavor intentalo denuevo.");
            res.redirect('/notes');
        }
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
        await noteshemma.findByIdAndUpdate(id,{titulo: tittle, categoria: category, contenido: content, updatedAt: format(currentDate, 'dd/MM/yyyy')})
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