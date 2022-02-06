const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')
const User = require('../models/User')
const Category = require('../models/Category')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Slider = require('../models/Slider')
const DeliveryCost = require('../models/DeliveryCost')
const Contacts = require('../models/Contacts')
const toDeleteFile = require('../utils/toDeleteFile')
const getPaginateForFrontend = require('../utils/getPaginateForFrontend')

module.exports.register = async function (req, res) {
    try {
        const admin = await Admin.findOne({ _id: req.body.id })
        if (admin && admin.name) {
            res.render('admin/register', {
                layout:'admin',
                message: "Администратор с таким номером уже существует.",
                title:'Панель администратора'
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const password = req.body.password
            const repeatPassword = req.body.repeatPassword
            const updated = {
                name: req.body.name,
                password: bcrypt.hashSync(password, salt)
            }
            if (password === repeatPassword) {
                await Admin.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: updated }
                )
                res.render('admin/login', {
                    layout:'admin',
                    message: 'Админ успешно создан.',
                    title:'Вход в панель администратора'
                })
            } else {
                res.render('admin/register', {
                    layout:'admin',
                    message: 'Пароли не совпадают',
                    data: req.body,
                    title:'Регистрация администратора'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports.login = async function (req, res) {
    try {
        const admin = await Admin.findOne({ telephone: req.body.telephone })
        if (admin) {
            const isPasswordTrue = bcrypt.compareSync(req.body.password, admin.password)
            if (isPasswordTrue) {
                req.session.admin = admin
                req.session.isAdmin = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/admin')
                })
            } else {
                res.render('admin/login', {
                    layout:'admin',
                    message: 'Введен неверный пароль.',
                    title:'Вход в панель администратора'
                })
            }
        } else {
            res.render('admin/login', {
                layout:'admin',
                message: 'Администратор с таким номером не найден.',
                title:'Вход в панель администратора'
            })
        }
    } catch (e) {
        console.log(e);
    }
}


module.exports.logout = function (req, res) {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}

module.exports.getAdminPanel = function (req, res) {
    res.render('admin/adminPanel',{
        layout:'admin',
        title:'Панель администратора'
    })
}

module.exports.getCategories = async function (req, res) {
    try {
        const categories = await Category.find()
        res.render('admin/categories', {
            layout:'adminProduct',
            categories,
            title: 'Категории товаров'
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.getCategoryEditPage = async function (req, res) {
    const category = await Category.findById(req.params.id)
    res.render('admin/categoryEdit', {
        layout:'adminProduct',
        category,
        title: 'Редактирование категорий'
    })
}

module.exports.getAddProductPage = async function (req, res) {
    try {
        const categories = await Category.find()
        if (categories.length) {
            res.render('admin/addProduct', {
                layout:'adminProduct',
                categories
            })
        } else {
            res.render('admin/addCategory', {
                layout:'adminProduct',
                error: 'Сперва создайте категорию для добавление продукта',
                title:'Добавить новую категорию'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.getProductsByCategoryId = async function (req, res) {
    try {
        const category = await Category.findById(req.params.categoryId)
        let perPage = 8
        let page = req.query.page || 1
        const options = {
            page,
            sort: { name: 1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };
        const query = { categoryId: req.params.categoryId }
        const products = await Product.paginate(query, options)
        const paginate = getPaginateForFrontend(products)
        res.render('admin/products', {
            layout:'adminProduct',
            products: products.docs,
            paginate,
            categoryName: category.name,
            categoryId: category._id,
            title:category.name
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getProductEditPage = async function (req, res) {
    try {
        const product = await Product.findById(req.params.productId)
        const categories = await Category.find()
        const categoriesList = categories.map(item => {
            if (item._id.toString() === product.categoryId.toString()) {
                return {
                    _id: item._id,
                    name: item.name,
                    selected: true
                }
            } else {
                return {
                    _id: item._id,
                    name: item.name
                }
            }
        })
        res.render('admin/editProduct', {
            layout:'adminProduct',
            product,
            categoriesList,
            title:'Редактирование продукта'
        })
    } catch (error) {
        console.log(error);
    }
}

//заказы start
module.exports.getOrderManagingPage = async function (req, res) {
    res.render('admin/ordersManagingPage',{
        layout:'admin',
        title:'Обработка заказов'
    })
}

module.exports.getOrders = async function (req, res) {
    let perPage = 5
    let page = req.query.page || 1
    const options = {
        page,
        sort: { date: -1 },
        limit: perPage,
        collation: {
            locale: 'en'
        },
        populate: {
            path: 'user',
            select: 'name telephone'
        },
        lean: true
    };
    let responseObject = {
        title: 'Все заказы'
    }
    let query = {
    }
    let queryString = ''
    //Условии филтрации
    // Дата старта
    if (req.query.start) {
        query.date = {
            //Больше либо равно 
            $gte: req.query.start
        }
        queryString = `&start=${req.query.start}`
    }
    //Дата конца
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }
        query.date['$lte'] = req.query.end
        queryString += `&end=${req.query.end}`

    }
    //Номер заказа
    if (req.query.order) {
        query.order = +req.query.order//Приводим к числу
        queryString += `&order=${req.query.order}`
    }

    if (req.query.timeId) {
        query.deliveryTimeId = req.query.timeId
        queryString += `&timeId=${req.query.timeId}`
        responseObject.deliveryTimeInterval = `Заказы в интервале ${req.query.timeId}:00-${+req.query.timeId + 2}:00`
        responseObject.title = `${req.query.timeId}:00-${+req.query.timeId + 2}:00`,
            responseObject.timeId = req.query.timeId
    }
    if (req.query.isDelivered) {//т.к тип данных req.query.isDelivered является строкой,данное условие выполниться
        query.isDelivered = req.query.isDelivered
        queryString += `&isDelivered=${req.query.isDelivered}`
    }
    if (req.query.telephone) {
        const user = await User.findOne({ telephone: req.query.telephone }).select('id')
        query.user = user.id
        queryString += `&telephone=${req.query.telephone}`
        responseObject.title = 'Поиск заказов'
    }
    try {
        const orders = await Order.paginate(query, options)
        const paginate = getPaginateForFrontend(orders)
        responseObject.layout = 'admin'
        responseObject.paginate = paginate
        responseObject.orders = orders.docs
        responseObject.queryString = queryString
        responseObject.query = req.query
        res.render('admin/orders', responseObject)
    } catch (error) {
        console.log(error);
    }
}
//заказы end

//Управление главной страницей start
module.exports.getIndexManagingPage = async function (req, res) {
    try {
        const slider = await Slider.find().sort({ number: 1 })
        res.render('admin/indexManagingPage', {
            layout:'admin',
            title: 'Управление главной страницей',
            slider
        })
    } catch (error) {
        console.log(error);
    }

}

module.exports.createOrUpdateLogo = async function (req, res) {
    res.redirect('/admin/index')
}

module.exports.addPhotoToSlider = async function (req, res) {
    try {
        const sliderElement = new Slider({
            number: req.body.number,
            ref: req.body.ref,
            imageSrc: req.file ? '/images/' + req.file.filename : ''
        })
        await sliderElement.save()
    } catch (error) {
        console.log(error);
    }
    res.redirect('/admin/index')
}

module.exports.deletePhotoFromSlider = async function (req, res) {
    try {
        const sliderElement = await Slider.findById(req.query.id)
        if (sliderElement.imageSrc) {
            await toDeleteFile(sliderElement.imageSrc)
        }
        await Slider.findByIdAndDelete(req.query.id)
    } catch (error) {
        console.log(error);
    }

    res.redirect('/admin/index')
}



//Управление контактами start
module.exports.getContacts = async function (req, res) {
    try {
        const contacts = await Contacts.findOne()
        res.render('admin/contacts', {
            layout:'admin',
            contacts,
            title:'Управление контактами'
        })

    } catch (e) {
        console.log(e);
    }
}

module.exports.setContacts = async function (req, res) {
    try {
        let contacts = await Contacts.findOne()
        if (contacts) {
            const updated = {}

            if (req.body.telephone) {
                updated.telephone = req.body.telephone
            }
            if (req.body.instagram) {
                updated.instagram = req.body.instagram
            }
            if (req.body.telegram) {
                updated.telegram = req.body.telegram
            }
            if (req.body.facebook) {
                updated.facebook = req.body.facebook
            }

            await Contacts.findByIdAndUpdate(
                { _id: contacts._id },
                { $set: updated },
                { new: true })
        } else {
            contacts = new Contacts({
                telephone: req.body.telephone,
                instagram: req.body.instagram,
                telegram: req.body.telegram,
                facebook: req.body.facebook,
            })
            await contacts.save()
        }
        res.redirect('/admin/getContacts')
    } catch (e) {
        console.log(e);
    }
}
//Управление контактами end


//Управление главной страницей end


//Стоимость доставки start
module.exports.getDeliveryCost = async function (req, res) {
    try {
        const deliveryCost = await DeliveryCost.findOne()
        res.render('admin/deliveryCost', {
            layout:'admin',
            deliveryCost,
            title:'Стоимость доставки'
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.setDeliveryCost = async function (req, res) {
    try {
        let deliveryCost = await DeliveryCost.findOne()
        if (deliveryCost) {
            const updated = {
                cost: req.body.deliveryCost,
            }
            await DeliveryCost.findByIdAndUpdate(
                { _id: deliveryCost._id },
                { $set: updated })
        } else {
            deliveryCost = new DeliveryCost({
                cost: req.body.deliveryCost
            })
            await deliveryCost.save()
        }
        res.redirect('/admin/getDeliveryCost')
    } catch (e) {
        console.log(e);
    }
}
//Стоимость доставки end


//Управление пользователями start

module.exports.getUsersManagingPage = async function (req, res) {

    res.render('admin/users',{
        layout:'admin',
        title:'Управление пользователями'
    })
}

// Поиск пользователей start
module.exports.search = async function (req, res) {
    let perPage = 5
    let page = req.query.page || 1
    const options = {
        page,
        sort: { name: 1 },
        limit: perPage,
        collation: {
            locale: 'en'
        }
    };
    const query = {}
    let queryString = ''
    if (req.query.telephone) {
        query.telephone = req.query.telephone
        queryString = '&telephone=' + req.query.telephone
    }
    if (req.query.name) {
        query.name = req.query.name
        queryString = '&name=' + req.query.name
    }
    if (req.query.blocked === 'on') {
        query.blocked = 'true'
        queryString = '&blocked=' + req.query.blocked
    }
    if (req.query.id) {
        query._id = req.query.id
    }
    try {
        const users = await User.paginate(query, options)
        const paginate = getPaginateForFrontend(users)
        res.render('admin/users-search', {
            layout:'admin',
            users: users.docs,
            paginate,
            queryString,
            query: req.query,
            title: 'Поиск пользователей',
            userError:req.flash('userError')
        })
    } catch (error) {
        console.log(error);
    }
}
// Поиск пользователей end

//Управление доступом пользователей start

module.exports.accessManager = async function (req, res) {
    const updated = {
        blocked: req.query.blocked
    }
    try {
        const user = await User.findByIdAndUpdate(
            { _id: req.query.id },
            { $set: updated },
            { new: true }
        )
        res.redirect(`/admin/users-search?id=${user._id}`)
    } catch (e) {
        console.log(e);
    }
}

//Управление доступом пользователей end
//Удаление пользователей start
module.exports.delete = async function (req, res) {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.redirect('/admin/users-search')
    } catch (error) {
        req.flash('userError','Произошла ошибка при удалении пользователя')
        console.log(error);
        res.redirect('/admin/users-search')
    }

}
//Удаление пользователей start

//Восстановление пароля пользователя start 
module.exports.usersForgotPassword = async function (req, res) {
    try {
        const candidate = await User.findOne({ telephone: req.body.telephone })
        if (candidate) {
            const salt = bcrypt.genSaltSync(10)
            const password = req.body.password
            const repeatPassword = req.body.repeatPassword
            if (password === repeatPassword) {
                const updated = {
                    password: bcrypt.hashSync(password, salt)
                }
                await User.findOneAndUpdate(
                    { telephone: req.body.telephone },
                    { $set: updated }
                )
                res.render('admin/users-forgot-password', {
                    layout:'admin',
                    message: 'Пароль успешно изменен.',
                    title:'Восстановление пароля пользователя'
                })
            } else {
                res.render('admin/users-forgot-password', {
                    layout:'admin',
                    message: 'Пароли не совпадают',
                    title:'Восстановление пароля пользователя'
                })
            }
        } else {
            res.render('admin/users-forgot-password', {
                layout:'admin',
                message: "Пользователь с таким номером не существует.",
                title:'Восстановление пароля пользователя'
            })
        }
    } catch (error) {
        console.log(error);
    }

}
//Восстановление пароля пользователя end

//Управление пользователями end

