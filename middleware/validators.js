const { body } = require('express-validator')
const User = require('../models/User')
exports.verifyValidators = [
    body('telephone').custom(async (value, { req }) => {
        const user = await User.findOne({ telephone: value })
        if (req.query.user) {
            if (user && user.name) {
                throw new Error('Такой номер уже зарегистрирован')
            }
        }
        if (req.query.forgot) {
            if (!(user && user.name)) {
                throw new Error('Пользователь с таким номером еще не зарегистрирован')
            }
        }
        return true
    }),
    body('verificationId','Произошла ошибка при отправке кода, попробуйте еще раз').notEmpty(),
    body('verificationCode','Вы не вводили проверочный код, попробуйте еще раз').notEmpty()
]
exports.registerValidators = [
    body('name', 'Имя должна состоять как минимум из 2х символов').isLength({ min: 2 }),
    body('password', 'Пароль должен состоять как минимум из 6 символов').isLength({ min: 6 }),
    body('repeatPassword').custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error('Пароли не совпадают!') }
        return true
    })
]

exports.loginValidators = [
    body('telephone')
        .notEmpty().withMessage('Введите номер телефона')
        .custom(async(value,{req})=>{
            const user = await User.findOne({telephone:value})
            if(!user){
                throw new Error('Пользователь с таким номером не найден.') 
            }
            if(user.blocked){
                throw new Error('Ваш аккаунт заблокирован, обратитесь в службу поддержки') 
            }
            return true
        }),
    body('password', 'Введите пароль').notEmpty()
]

exports.forgotValidators =[
    body('password', 'Пароль должен состоять как минимум из 6 символов').isLength({ min: 6 }),
    body('repeatPassword').custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error('Пароли не совпадают!') }
        return true
    })
]

exports.categoryValidators = [
    body('name','Введите название категории').notEmpty()
]

exports.productValidator = [
    body('categoryId','Выберите категорию к которому относится добавляемый продукт').notEmpty(),
    body('name','Введите название продукта').notEmpty(),
    body('cost','Введите цену продукта').notEmpty(),
]

exports.orderValidators = [
    body('timeId','Пожалуйста выберите время доставки').notEmpty(),
    body('timeInterval','Пожалуйста выберите время доставки').notEmpty(),
    body('latitude','Укажите пожалуйста свой адрес ').notEmpty(),
    body('longitude','Укажите пожалуйста свой адрес ').notEmpty()
]