const noteshemma = require('../models/Notes');

const notesRender = async (req,res) => {
    const userInfo = req.user.user || null;
    res.render('../views/layouts/notes', {layout: 'notes.hbs', userName: userInfo});
}

// const addNotesForm = async (req, res) => {
//     // res.render('../views/')
// }

const addNote = async (req,res) => {
    const {tittle, category, content} = req.body;
    const error = [];

    //Validate with array errors

    console.log(tittle, category, content);

    if(tittle == "" || category == "" || content == ""){
        error.push('Todos los datos son requeridos.')
    }

    if(error.length > 0){
        res.render('../views/layouts/notes', {layout: 'notes.hbs', error});
    }else{
        // it have to save the id, tittle etc...
        //const newNote = new noteshemma({})
        console.log(req.user)
    }
}

const logout = async (req,res) => {
    req.logout();
    req.flash('success_msg', 'session cerada.');
    res.redirect('/auth');
}


module.exports = {notesRender, logout, addNote}