const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/auth')
const {registerValidators}= require('../middleware/validators')
const {loginValidators}= require('../middleware/validators')
const {verifyValidators} = require('../middleware/validators')
const {forgotValidators} = require('../middleware/validators')

router.get('/verify',controllers.getVerifyPage)
router.post('/verify',verifyValidators,controllers.verify)

router.get('/register', (req, res) => {
    res.render('register',{
        title:'Регистрация пользователя'
    })
})

router.post('/register', registerValidators,controllers.register)


router.get('/login', controllers.getLoginPage)

router.post('/login',loginValidators, controllers.login)

router.get('/forgot',controllers.getForgotPage)
router.post('/forgot',forgotValidators,controllers.forgot)

router.get('/logout', controllers.logout)


module.exports = router