const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/product')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/admin')
const upload = require('../middleware/upload')



router.get('/:categoryId', controllers.getByCategoryId)
router.get('/', controllers.getByProductName)
router.post('/',isAdmin, upload.single('image'), controllers.create)

router.post('/edit/:id', isAdmin, upload.single('image'), controllers.update)

router.get('/delete/:id', isAdmin, controllers.remove)

module.exports = router