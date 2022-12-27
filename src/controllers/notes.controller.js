
const notesRender = async (req,res) => {
    res.render('../views/layouts/notes', {layout: 'notes.hbs'});
}


module.exports = {notesRender}