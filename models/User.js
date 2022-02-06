const mongoose = require('mongoose')
const paginate=require('mongoose-paginate-v2')
const { Schema, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String
    },
    telephone: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    blocked:{
        type:Boolean,
        default:false
    },
    cart: {
        list: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = async function (productId, count) {

    const newList = this.cart.list.concat()
    const index = newList.findIndex(item => {
        return item.productId._id.toString() === productId.toString()
    })
    if (index >= 0) {
        newList[index].count = newList[index].count + count
    } else {
        newList.push({ count, productId})
    }
    const newCart = { list: newList }
    this.cart = newCart
    return this.save()
}

userSchema.methods.getCart = function () {
    return this.cart.list
}

userSchema.methods.deleteProduct = function (productId) {
   
    const newList = this.cart.list.concat()

    const index = newList.findIndex(item => {
        return item.productId.toString() === productId.toString()
    })
    if (index >= 0) {
        newList.splice(index, 1)
    }
    const newCart = { list: newList }
    this.cart = newCart
    return this.save()
}

userSchema.methods.updateCart = function (productId, count) {
    const newList = this.cart.list.concat()
    const index = newList.findIndex(item => {
        return item.productId.toString() === productId.toString()
    })
    if (index >= 0) {
        newList[index].count = count > 0 ? count : 1
    }
    const newCart = { list: newList }
    this.cart = newCart
    return this.save()
}

userSchema.methods.cleanCart = function (productId, count) {
    this.cart.list = []
    return this.save()
}

userSchema.plugin(paginate)
module.exports = model('User', userSchema)