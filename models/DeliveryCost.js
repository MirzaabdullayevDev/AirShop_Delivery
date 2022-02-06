const {Schema,model} = require('mongoose')

const deliveryCostSchema=new Schema({
    cost:{
        type:Number,
        required:true
    }
})

module.exports=model('DeliveryCost',deliveryCostSchema)


