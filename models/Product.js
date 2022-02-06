const mongoose=require('mongoose')
const paginate=require('mongoose-paginate-v2')
const {Schema,model}=mongoose

const productSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    imageSrc:{
        type:String,
        default:''
    },
    categoryId:{
        ref:'categories',
        type:Schema.Types.ObjectId
    },
    isExist:{//наличия товара
        type:Boolean,
        default:true
    },
    caseNumber:{//Номер полки где размещен товар
        type:Number,
        default:0
    },
    showInProductSlider:{
        type:Boolean,
        default:false
    },
    priority:{//Приоритет вывода на главной странице
        type:Number,
        default:999999999999
    }
})

productSchema.plugin(paginate)


module.exports=model('Product',productSchema)