const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/userAccaunt')
const auth = require('../middleware/auth')
router.get('/',auth, controllers.getUserInfo)

router.post('/',auth, controllers.update)

module.exports = router
