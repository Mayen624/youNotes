const jwt = require('jsonwebtoken');

const validateToken = async(req,res,next) => {

    const token = req.query.token;

    if(!token){
        req.flash('error_msg', 'Token requerido!');
        return res.redirect('/');
    }

    try {
        const decoded = await jwt.verify(token, process.env.RESET_SKEY_SECRET);;
        req.token = token;
        next();
    } catch (e) {
        if(e.message == 'jwt expired'){
            req.flash('error_msg', 'Token expirado.');
            return res.redirect('/');
        }else if(e.message == 'invalid token'){
            req.flash('error_msg', 'Token no valido.');
            return res.redirect('/');
        }
        req.flash('error_msg', e.message);
        return res.redirect('/');
    }
}

module.exports = {validateToken};