const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userShemma = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    const user = await userShemma.findOne({ email });

    if (!user) {
        return done(null, false, { message: 'Usuario no encontrado.' });
    } else {
        if (!user.enabled === false) {
            return done(null, false, { message: 'Este usuario esta deshabilitado o no ha finalizado la confirmacion de su cuenta por correo.' });
        }

        const match = await user.matchPassword(password);
        if (!match) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
        } else {
            return done(null, user);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userShemma.findById(id, (err, user) => {
        done(err, user);
    })
})