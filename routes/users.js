const router = require('express').Router()
const {indexGet, aboutGet, contactGet, registerGet, registerPost} = require('../controllers/defaultController')



router.get('/', indexGet)
router.get('/about', aboutGet)
router.get('/contact', contactGet)

router.route('/register')
.get(registerGet)
.post(registerPost)











module.exports = router