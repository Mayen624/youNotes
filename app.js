const { dbConnect } = require('./src/db/Connection.js');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const dotenv = require('dotenv');
const sharp = require('sharp');
const path = require('path');
const app = express();

require('./src/config/passport');

//Config
dotenv.config(); // Allow use files .env
app.use(morgan('dev')); // Allow to show method http, status codes http and time in console during server is up
app.use(express.urlencoded({ extended: false }));

app.set('PORT', process.env.PORT || 5000);

// View engine config
app.set('views', path.join(__dirname, 'src/views')) //  get the view dir 
app.engine('.hbs', exphbs({
    layoutsDir: path.join(app.get('views'), '/layouts'),
    partialsDir: path.join(app.get('views'), '/partials'),
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'secret',
    resave: true,
    cookie: { _expires: 3600000 },
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'src/uploads'));
    },
    filename: (req, file, cb, filename) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    }
});

app.use(multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));

        if (mimetype && extname) {
            return cb(null, true);
        }
        
        req.uploadError = new Error('Formato de imagen no permitida. Formatos validos: jpeg, jpg, png, gif.');
        cb(null, false);

    }
}).single('img'));

//Static files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/bi', express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use('/images', express.static(__dirname + '/src/public/images'));
app.use('/public', express.static(__dirname + '/src/public'));
app.use('/uploads', express.static(__dirname + '/src/uploads'));

//Routes
const indexRoutes = require('./src/routes/auth.routes');
const signUpRoutes = require('./src/routes/signUp.routes');
const staticRoutes = require('./src/routes/static.routes');
const noteRoutes = require('./src/routes/notes.routes');
const profileRoutes = require('./src/routes/profile.routes');

//Using routes
//app.use('/', mainRoute); 
app.use('/auth', indexRoutes);
app.use('/about', staticRoutes);
app.use('/signup', signUpRoutes);
app.use('/notes', noteRoutes);
app.use('/profile', profileRoutes);

// Middleware 404 para manejar errores de rutas no encontradas
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// // Middleware de manejo de errores para manejar cualquier otro error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render(app.get('views') + '/layouts/404', {
        error_msg: 'Not Found',
        description: 'Lo sentimos, ha ocurrido un error, pagina no encontrada!'
    });
});

//Port listening...
app.listen(app.get('PORT'), () => {
    console.log('Server up on port:', app.get('PORT'));
    dbConnect();
})

