const {Schema,model} = require('mongoose')

const categorySchema=new Schema({

    name:{
        type:String,
        required:true
    },
    imageSrc:{
        type:String,
        default:''  
    },
    priority:{//Приоритет вывода на главной странице
        type:Number,
        default:999999999999

    }
})


module.exports=model('Category',categorySchema)


