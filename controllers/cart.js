const Product = require('../models/Product')
const moment = require('moment')
const getCart = require('../utils/getCart')
const User = require('../models/User')
module.exports.add = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        user.addToCart(req.body.productId, +req.body.count)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.status(200).json({
            countProducts: cart.countProducts,
            totalCost: cart.totalCost
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        if (req.query.fromAxios) {
            res.status(200).json({
                countProducts: cart.countProducts,
                totalCost: cart.totalCost
            })
        } else {
            res.render('cart', {
                layout: 'cart',
                cart,
                cartError:req.flash('cartError'),
                title:'Корзина'
            })
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports.remove = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        await user.deleteProduct(req.params.productId)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.json(cart)
    } catch (e) {
        console.log(e);
    }
}

module.exports.update = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        await user.updateCart(req.body.productId, +req.body.count)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.json(cart)
    } catch (e) {
        console.log(e);
    }
}