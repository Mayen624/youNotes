import {Router} from 'express'
const router = Router();


//Main route - login
router.get('/', (req,res) => {
    res.render('index', {title: 'Login - YouNotes'});
})

router.get('/about', (req,res) => {
    res.render('static/about', {title: 'About- YouNotes'})
})

router.get('/signup', (req,res) => {
    res.render('static/signup', {title: 'Sigup - YouNotes'});
})

router.get('/home', (req,res) => {
    res.render('static/home', {title: 'Sigup - YouNotes'});
})

//req post - login

export default router;