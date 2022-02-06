const { model, Schema } = require('mongoose')

const adminSchema = new Schema({
    name: {
        type: String,
    },
    telephone: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
})


module.exports=model('Admin',adminSchema)