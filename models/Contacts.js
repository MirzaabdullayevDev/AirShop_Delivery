const {model,Schema}=require('mongoose')

const contactsSchema = new Schema({
    telephone:{
        type:String
    },
    instagram:{
        type:String
    },
    telegram:{
        type:String
    },
    facebook:{
        type:String
    }
})

module.exports = model('Contacts',contactsSchema)