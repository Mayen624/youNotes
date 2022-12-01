import path, { dirname } from 'path';
import {fileURLToPath} from 'url';
import exphbs from 'express-handlebars';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
const app = express();


//Config
dotenv.config(); // Allow use files .env
app.use(morgan('dev')); // Allow to show method http, status codes http and time on console during server is up
app.set('PORT', process.env.PORT);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
import indexRoutes from './src/routes/index.routes.js';

//Using routes
app.use('/', indexRoutes);

//Port listening...

app.listen(app.get('PORT'), () => {
    console.log('Server up on port:', app.get('PORT'));
})

