const router = require('express')();
const { signup, login } = require('../controllers/authorController');


router.post('/signup',signup);
router.post('/login',login);


module.exports = router;