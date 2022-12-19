const {Router} = require('express');
const router = Router();

router.get('/', (req,res) => {
    res.render('../views/static/about');
});

module.exports = router;