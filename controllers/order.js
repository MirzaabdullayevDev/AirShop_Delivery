const Order = require('../models/Order')
const getCart = require('../utils/getCart')
const getListForOrder = require('../utils/getListForOrder')
const getPaginateForFrontend = require('../utils/getPaginateForFrontend')
const moment = require('moment')
const User = require('../models/User')
const DeliveryCost = require('../models/DeliveryCost')
const Drivers = require('../models/Drivers')
const { validationResult } = require('express-validator');

module.exports.getAll = async function (req, res) {
    let query = { user: req.session.user._id }
    try {
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
                select: 'telephone'
            },
            lean: true,
        };
        let orders = await Order.paginate(query, options)
        const paginate = getPaginateForFrontend(orders)
        res.render('orders', {
            orders: orders.docs,
            paginate,
            title: 'Заказы'
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports.create = async function (req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('cartError', errors.array()[0].msg)
            return res.status(422).redirect('/cart')
        }
        const orders = await Order.find().sort({ date: -1 })
        const maxOrder = orders.length > 0 ? orders[0].order : 0
        const deliveryCost = await DeliveryCost.findOne()
        let user = await User.findById(req.session.user._id)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        const orderTotalCost = cart.totalCost + deliveryCost.cost
        if (cart.countProducts > 0) {
            const list = getListForOrder(cart.list)
            await new Order({
                order: maxOrder + 1,
                list,
                cartTotalCost: cart.totalCost,
                deliveryCost: deliveryCost.cost,
                orderTotalCost,
                deliveryTimeId: req.body.timeId,
                deliveryTimeInterval: req.body.timeInterval,
                adress: {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                },
                user: req.session.user._id
            }).save()
            await user.cleanCart()
            res.redirect('/orders')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.setWrappedAndDeliveredState = async function (req, res) {
    try {
        const { order, isWrapped, isDelivered } = req.body
        if (isWrapped !== undefined) {
            const updated = {
                isWrapped: isWrapped
            }
            await Order.findOneAndUpdate(
                { order: +order },
                { $set: updated },
                { new: true }
            )
            res.status(200).json({
                message: 'success'
            })
        }

        if (isDelivered !== undefined) {
            const updated = {
                isDelivered: isDelivered
            }
            await Order.findOneAndUpdate(
                { order: +order },
                { $set: updated },
                { new: true }
            )
            res.status(200).json({
                message: 'success'
            })
        }
    } catch (error) {
        res.json({
            message: 'error'
        })
        console.log(error);
    }
}

module.exports.showOrdersOnMap = async function (req, res) {
    let { timeId } = req.query
    let responseObject = {
        title: 'Все заказы'
    }
    if (timeId) {
        responseObject.timeId = timeId
        const timeIntervalStart = timeId
        const timeIntervalEnd = parseInt(timeId) + 2
        responseObject.title = `${timeIntervalStart}:00-${timeIntervalEnd}:00`
    }
    res.render('admin/ordersOnMap', {
        layout: 'map',
        ...responseObject
    })
}
module.exports.delete = async function (req, res) {
    try {
        await Order.findOneAndDelete({ order: req.params.order })
        res.json({
            message: 'deleted'
        })
    } catch (error) {
        res.json({
            message: 'don`t deleted'
        })
    }
}
module.exports.getAdress = async function (req, res) {
    try {
        const { timeId } = req.query
        let query = {
            isDelivered: false
        }
        if (timeId) {
            query.deliveryTimeId = timeId
        }
        const orders = await Order.find(query).select('adress order')
        let orderList = []
        let conditions = false
        for (let i = 0; i < orders.length; i++) {
            conditions = orders[i].adress.latitude && orders[i].adress.longitude
            if (conditions) {
                obj = {
                    //nomer zakaza
                    //adress
                    adress: orders[i].adress,
                    order: orders[i].order
                }
                orderList.push(obj)
            }
        }
        res.json({
            orderList
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.sendLocation = async function (req, res) {
    try {
        const { orderNumber } = req.params
        const bot = require('../models/driverBot')
        let order = await Order.findOne({ order: orderNumber }).populate('user', 'name telephone')
        const drivers = await Drivers.find({ access: true })
        const lat = order.adress.latitude
        const long = order.adress.longitude
        let orderList = ''
        order.list.map((item) => {
            orderList +=
                `${item.name}, ${item.count}, ${item.sum} Сум
    `
        })
        const orderInfo =
            `*Заказ №${order.order}*
    ------------------------------------------
    ${orderList}
    *Всего* - ${order.cartTotalCost} Сум
    *Доставка* - ${order.deliveryCost} Сум
    *Итого* - ${order.orderTotalCost} Сум
    *Дата заказа* - ${moment(order.date).utcOffset(5).format('DD.MM.YYYY  HH:mm')}
    *Время доставки* - ${order.deliveryTimeInterval}
    *Клиент* - ${order.user.name}
    *Номер клиента* - ${order.user.telephone}
    `
        if (lat && long) {
            for (let i = 0; i < drivers.length; i++) {
                await bot.sendMessage(drivers[i].chatId, orderInfo, {
                    parse_mode: 'Markdown'
                })
                await bot.sendLocation(drivers[i].chatId, lat, long)
            }
        }
        res.json({
            message: 'sent'
        })
    } catch (error) {
        console.log(error.message);
    }
}