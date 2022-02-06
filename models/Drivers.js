const { model, Schema } = require('mongoose')
const driverSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    access:{
        type:Boolean,
        default:false
    },
    chatId:{
        type:String,
        required:true
    }
})

module.exports = model('Drivers',driverSchema)