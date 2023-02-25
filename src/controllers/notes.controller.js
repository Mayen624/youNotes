const noteshemma = require('../models/Notes');
const categoryShemma = require('../models/Categories');

const notesRender = async (req,res) => {
    const userInfo = req.user;
    res.render('../views/layouts/notes', {layout: 'notes.hbs', userName: userInfo.user});
    console.log(userInfo)
}

// const addNotesForm = async (req, res) => {
//     // res.render('../views/')
// }

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
                contenido: content
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

const logout = async (req,res) => {
    req.logout();
    req.flash('success_msg', 'session cerada.');
    res.redirect('/auth');
}


module.exports = {notesRender, logout, addNote}