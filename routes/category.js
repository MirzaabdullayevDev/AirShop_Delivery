const { Router } = require('express')
const isAdmin = require('../middleware/admin')

const upload = require('../middleware/upload')
const controllers = require('../controllers/category')
const router = Router()

router.get('/', controllers.getAll)

router.get('/delete/:id', isAdmin, controllers.delete)

router.post('/', isAdmin, upload.single('image'), controllers.create)

router.post('/edit/:id', isAdmin, upload.single('image'), controllers.update)

module.exports = router