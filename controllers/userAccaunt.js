const User = require('../models/User')
const bcrypt = require('bcryptjs')
module.exports.getUserInfo = async function (req, res) {
    const user = await User.findOne({ _id: req.session.user._id })
    res.render('userAccaunt', {
        isAuth: req.session.isAuthenticated,
        user,
        title:'Аккаунт пользователя'
    })
}


module.exports.update = async function (req, res) {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    let updated = {}
    if (req.body.password !== '') {
        updated.password = bcrypt.hashSync(password, salt)
    }
    if (req.body.name !== '') {
        updated.name = req.body.name
    }
    try {
        await User.findOneAndUpdate(
            { _id: req.session.user._id },
            { $set: updated },
            { new: true })

        res.redirect('/userAccaunt')
    } catch (error) {
        condole.log(error);
    }
}