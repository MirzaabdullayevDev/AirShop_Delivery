const {model,Schema} = require('mongoose')

const infoSchema = new Schema({
    aboutUs:{
        type:String,
        default:'emty'
    },
    agreement:{
        type:String,
        default:'emty'
    },
    contacts:{
        type:String,
        default:'emty'
    },
    faq:{
        type:String,
        default:'emty'
    }
})

module.exports = model('Info',infoSchema)