//Validate if the user is authtenticated
const isAuthenticated = async (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash("warning_msg" , "Se requiere inicio de sesion." );
    res.redirect('/');
}

module.exports = {isAuthenticated};