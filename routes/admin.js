const {Router}=require('express')
const controllers=require('../controllers/admin')
const upload = require('../middleware/upload')
const isAdmin=require('../middleware/admin')
const router=Router()

router.post('/register',controllers.register)

router.get('/login',(req,res)=>{
    res.render('admin/login',{
        layout:'adminProduct',
        title:'Вход в панель администратора'
    })
})
router.post('/login',controllers.login)

router.get('/logout',controllers.logout)

router.get('/',isAdmin,controllers.getAdminPanel)

router.get('/addProduct',isAdmin,controllers.getAddProductPage)

router.get('/products/:categoryId',isAdmin,controllers.getProductsByCategoryId)

router.get('/editProduct/:productId',isAdmin,controllers.getProductEditPage)


router.get('/addCategory',isAdmin,(req,res)=>{
    res.render('admin/addCategory',{
        layout:'adminProduct',
        title:'Добавить новую категорию'
    })
})
router.get('/categoryEdit/:id',isAdmin,controllers.getCategoryEditPage)
router.get('/categories',isAdmin,controllers.getCategories)

router.get('/ordersManagingPage',isAdmin,controllers.getOrderManagingPage)
router.get('/orders',isAdmin,controllers.getOrders)

router.get('/index',isAdmin,controllers.getIndexManagingPage)

router.get('/createOrUpdateLogo',isAdmin,(req,res)=>{
    res.render('admin/createOrUpdateLogo',{
        layout:'adminProduct',
    })
})

router.post('/createOrUpdateLogo',isAdmin,upload.single('image'),controllers.createOrUpdateLogo)

router.get('/addPhotoToSlider',isAdmin,(req,res)=>{
    res.render('admin/addPhotoToSlider',{
        layout:'adminProduct',
        title:'Добавление фото к слайдеру'
    })
})

router.post('/addPhotoToSlider',isAdmin,upload.single('image'),controllers.addPhotoToSlider)

router.get('/deletePhotoFromSlider',isAdmin,controllers.deletePhotoFromSlider)

router.get('/getDeliveryCost',isAdmin,controllers.getDeliveryCost)
router.post('/setDeliveryCost',isAdmin,controllers.setDeliveryCost)


router.get('/getContacts',isAdmin,controllers.getContacts)
router.post('/setContacts',isAdmin,controllers.setContacts)

router.get('/users',isAdmin,controllers.getUsersManagingPage)
router.get('/users-search',isAdmin,controllers.search)
router.get('/users-forgot',isAdmin,(req,res)=>{
    res.render('admin/users-forgot-password',{
        layout:'admin',
        title:'Восстановление пароля пользователя'
    })
})
router.post('/users-forgot-password',isAdmin,controllers.usersForgotPassword)
router.get('/userAccessManaging',isAdmin,controllers.accessManager)
router.get('/delete-user/:id',isAdmin,controllers.delete)
module.exports=router