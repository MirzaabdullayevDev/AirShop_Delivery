const Product = require('../models/Product')
const Category = require('../models/Category')
const Slider = require('../models/Slider')
module.exports.getIndex = async (req, res) => {
    try {
        const categories = await Category.find().sort({priority:1})       
        const slider = await Slider.find().sort({number:1})
        const products = await Product.find({showInProductSlider:true}).sort({priority:1})
        res.render('index', {
            slider,
            categories,
            products,
            title:'Интернет магазин продуктов'
        })
    } catch (e) {
        console.log(e);
    }
}