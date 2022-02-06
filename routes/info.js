const {Router} = require('express')
const controllers = require('../controllers/info')
const router = Router()
const isAdmin=require('../middleware/admin')

router.get('/getCreateOrEditInfoPage',isAdmin, controllers.getCreateOrEditInfoPage)
router.post('/createOrEdit',isAdmin,controllers.createOrEdit)
router.get('/about-us',controllers.aboutUs)
router.get('/agreement',controllers.agreement)
router.get('/contacts',controllers.contacts)
router.get('/getContactsAsJSON',controllers.getContactsAsJSON)
router.get('/instruction',controllers.instruction)

module.exports = router