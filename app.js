const {dbConnect} = require('./src/db/Connection.js');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv');
const path = require('path');
const app = express();

require('./src/config/passport');

//Config
dotenv.config(); // Allow use files .env
app.use(morgan('dev')); // Allow to show method http, status codes http and time on console during server is up
app.use(express.urlencoded({extended: false}));

app.set('PORT', process.env.PORT || 5000);

// View engine config
app.set('views', path.join(__dirname, 'src/views')) //  get the view dir 
app.engine('.hbs', exphbs.engine({
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
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 


//Global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})

//Static files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/bi', express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use('/public', express.static(__dirname + '/src/public')); 

//Routes
const indexRoutes = require('./src/routes/auth.routes');
const signUpRoutes = require('./src/routes/signUp.routes');
const staticRoutes = require('./src/routes/static.routes');
const noteRoutes = require('./src/routes/notes.routes');

//Using routes
//app.use('/', mainRoute); 
app.use('/auth', indexRoutes); 
app.use('/about', staticRoutes); 
app.use('/signup', signUpRoutes);
app.use('/notes', noteRoutes);

//Port listening...
//const ip = '0.0.0.0';
app.listen(app.get('PORT'), () => {
    console.log('Server up on port:', app.get('PORT'));
    dbConnect();
})

