const { model, Schema } = require('mongoose')

const sliderSchema = new Schema({
    imageSrc: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    ref:{
        type:String,
        required:true
    }
})

module.exports = model('Slider', sliderSchema)