const { Router } = require('express')
const controllers = require('../controllers/deliveryCost')
const router = Router()
const isAdmin = require('../middleware/admin')


router.get('/', controllers.getDeliveryCost)

router.post('/', isAdmin, controllers.setDeliveryCost)


module.exports = router