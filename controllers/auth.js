const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    // ...
    apiKey: "AIzaSyDAExM_ugRA98nQI7W-FsKq1AA-WxQKJrg",
    authDomain: "airmarket-35b84.firebaseapp.com",
    databaseURL: "https://airmarket-35b84.firebaseio.com",
    projectId: "airmarket-35b84",
    storageBucket: "airmarket-35b84.appspot.com",
    messagingSenderId: "958389086537",
    appId: "1:958389086537:web:75e1c29f055e13eef69298"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
///////////////////////////////////////////////
const User = require('../models/User')
const { validationResult } = require('express-validator');

module.exports.getVerifyPage = async function (req, res) {
    let action = '/auth/verify?user=true'
    let page = ''
    if (req.query.forgot) { action = '/auth/verify?forgot=true' }
    if (req.query.admin) {
        action = '/auth/verify?admin=true'
        page = 'admin'
    }
    res.render('verify', {
        layout:'info',
        action,
        page,
        verifyError: req.flash('verifyError'),
        title: 'Подтверждение номера телефона'
    })
}

module.exports.verify = async function (req, res) {
    let ref = '/auth/verify?user=true'
    let page = 'userRegister'
    const { verificationId, verificationCode } = req.body
    const { forgot, admin } = req.query
    if (admin) {
        ref = '/auth/verify?admin=true'
        page = 'adminRegister'
    }
    if (forgot) {
        ref = '/auth/verify?forgot=true'
    }
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        req.flash('verifyError', errors.array()[0].msg)
        return res.status(422).redirect(ref)
    }
    try {
        var credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        firebase.auth().signInWithCredential(credential)
            .then(async (result) => {
                let phoneNumber = ''
                if (admin) {
                    phoneNumber = req.body.telephone
                } else {
                    phoneNumber = result.user.phoneNumber
                }

                if (req.query.user) {
                    let user = await User.findOne({ telephone: phoneNumber })
                    if (!user) {
                        user = User({ telephone: phoneNumber })
                        await user.save()
                    }
                    res.render('register', {
                        layout:'info',
                        data: {
                            telephone: phoneNumber,
                            id: user._id,
                            page,
                        },
                        title: 'Регистрация пользователя'
                    })
                }

                if (req.query.forgot) {
                    let user = await User.findOne({ telephone: phoneNumber })
                    if (user) {
                        res.render('forgot', {
                            layout:'info',
                            data: {
                                telephone: phoneNumber,
                                id: user._id
                            },
                            title: 'Восстановление пароля'
                        })
                    }
                }

                if (req.query.admin) {
                    let admin = await Admin.findOne({ telephone: phoneNumber })
                    if (!admin) {
                        admin = Admin({ telephone: phoneNumber })
                        await admin.save()
                    }
                    res.render('admin/register', {
                        layout:'info',
                        data: {
                            id: admin._id,
                            telephone: phoneNumber
                        },
                        title: 'Регистрация администратора'
                    })
                }
            })
    } catch (error) {
        console.log(error);
        req.flash('verifyError', 'Произошла ошибка при подтверждении номера, попробуйте еще раз')
        res.redirect(ref)
    }
}

module.exports.register = async function (req, res) {
    try {
        const { name, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('register', {
                layout:'info',
                registerError: errors.array()[0].msg,
                data: req.body,
                title: 'Регистрация пользователя'
            })
        }
        const salt = bcrypt.genSaltSync(10)
        const updated = {
            name,
            password: bcrypt.hashSync(password, salt)
        }
        await User.findOneAndUpdate(
            { _id: req.body.id },
            { $set: updated }
        )
        req.flash('loginSucces', 'Аккаунт успешно создан')
        res.redirect('/auth/login')

    } catch (error) {
        req.flash('registerError', 'Произошла ошибка при регистрации, попробуйте ещё раз')
        res.redirect('/auth/verify?user=true')
    }
}

module.exports.getLoginPage = function (req, res) {
    res.render('login', {
        layout:'info',
        loginSucces: req.flash('loginSucces'),
        loginError: req.flash('loginError'),
        title: 'Вход в аккаунт'
    })
}

module.exports.login = async function (req, res) {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('login', {
                layout:'info',
                loginError: errors.array()[0].msg,
                data: req.body,
                title: 'Вход в аккаунт'
            })
        }
        const user = await User.findOne({ telephone: req.body.telephone })
        const isCorrectPassword = bcrypt.compareSync(req.body.password, user.password)
        if (isCorrectPassword) {
            req.session.user = user
            req.session.isAuthenticated = true
            req.session.save(err => {
                if (err) {
                    throw err
                }
                res.redirect('/')
            })
        } else {
            res.render('login', {
                layout:'info',
                loginError: 'Введен неверный пароль.',
                data: req.body,
                title: 'Вход в аккаунт'
            })
        }
    } catch (error) {
        req.flash('loginError', error)
        res.redirect('/auth/login')
    }
}

module.exports.getForgotPage = async function (req, res) {
    res.render('forgot', {
        layout:'info',
        title: 'Восстановление пароля'
    })
}

module.exports.forgot = async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('forgot', {
            layout:'info',
            forgotError: errors.array()[0].msg,
            data: req.body,
            title: 'Восстановление пароля'
        })
    }
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    const updated = {
        password: bcrypt.hashSync(password, salt)
    }
    await User.findOneAndUpdate(
        { _id: req.body.id },
        { $set: updated }
    )
    req.flash('loginSucces', 'Пароль успешно восстановлен')
    res.redirect('/auth/login')
}

module.exports.logout = function (req, res) {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
}