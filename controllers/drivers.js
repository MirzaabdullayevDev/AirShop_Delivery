const Drivers = require('../models/Drivers')
const bot = require('../models/driverBot')
module.exports.register = async function(msg){
    const chatId = msg.chat.id
    if (chatId) {
        let driver = await Drivers.findOne({ chatId: chatId })
        if (!driver) {
            driver = Drivers({
                chatId: chatId,
                name: msg.from.first_name
            })
            await driver.save()
            bot.sendMessage(chatId, 'Отправлен запрос на подтверждение')
        }else if(driver.access){
            bot.sendMessage(chatId, 'Вы уже зарегистрированы')
        }else{
            bot.sendMessage(chatId, 'Вы уже отправили запрос на регистрацию')
        }
    }
}

module.exports.getAll = async function (req, res) {
    try {
        const drivers = await Drivers.find()
        res.render('admin/drivers', {
            layout:'admin',
            title: 'Управление водителями',
            drivers
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.accessManager = async function (req, res) {
    try {
        let { chatId } = req.params
        let { access } = req.query
        const updated = {
            access
        }
        await Drivers.findOneAndUpdate(
            { chatId: chatId },
            { $set: updated }
        )
        if(access==='true'){
            bot.sendMessage(chatId,'Доступ включен')
        }else{
            bot.sendMessage(chatId,'Доступ отключен')
        }
        res.redirect('/drivers')
    } catch (error) {
        console.log(error);
    }

}

module.exports.delete = async function (req, res) {
    try {
        let { chatId } = req.params
        await Drivers.deleteOne({ chatId: chatId })
        res.redirect('/drivers')
    } catch (error) {
        console.log(error);
    }

}