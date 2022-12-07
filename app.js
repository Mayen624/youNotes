const {dbConnect} = require('./src/db/Connection.js');
const exphbs = require('express-handlebars');
const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv');
const path = require('path');
const app = express();


//Config
dotenv.config(); // Allow use files .env
app.use(morgan('dev')); // Allow to show method http, status codes http and time on console during server is up
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

//Static files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/bi', express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use('/public', express.static(__dirname + '/src/public')); 

//Routes
const indexRoutes = require('./src/routes/index.routes.js');

//Using routes
app.use('/', indexRoutes); 

//Port listening...

app.listen(app.get('PORT'), () => {
    console.log('Server up on port:', app.get('PORT'));
    dbConnect();
})

