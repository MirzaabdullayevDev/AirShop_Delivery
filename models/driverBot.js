const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '1121446184:AAFfWw8639R4-un2_GC-fXwa3DPxMkoNZsw'
console.log('Bot has been started...');
const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

module.exports = bot