const { Router } = require('express')
const controllers = require('../controllers/drivers')
const router = Router()
const isAdmin = require('../middleware/admin')


router.get('/', controllers.getAll)

router.get('/:chatId',controllers.accessManager)

router.get('/delete/:chatId', isAdmin, controllers.delete)



module.exports = router