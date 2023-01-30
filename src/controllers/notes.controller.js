
const notesRender = async (req,res) => {
    res.render('../views/layouts/notes', {layout: 'notes.hbs'});
}

const logout = async (req,res) => {
    req.logout();
    req.flash('success_msg', 'session cerada.');
    res.redirect('/auth');
}


module.exports = {notesRender, logout}