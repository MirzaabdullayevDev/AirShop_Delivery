const Category = require('../models/Category')
const Product = require('../models/Product')
const toDeleteFile = require('../utils/toDeleteFile')

module.exports.create = async function (req, res) {
    let category = new Category({
        name: req.body.name,
        imageSrc: req.file ? '/images/' + req.file.filename : '',
    })
    if (req.body.priority!=='') {
        category.priority = req.body.priority
    }
    try {
        await category.save()
        res.redirect('/admin/categories')
    } catch (e) {
        console.log(e);
    }

}

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find()
        if (req.query.asynchronicQuery) {
            res.json(categories)
        } else {
            res.render('categories', {
                isAuth: req.session.isAuthenticated,
                categories,
                title: 'Категории товаров'
            })
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name,
        priority: req.body.priority
    }
    try {
        if (req.file) {
            const category = await Category.findById(req.params.id)

            if (category.imageSrc) {
                await toDeleteFile(category.imageSrc)
            }
            updated.imageSrc = req.file ? '/images/' + req.file.filename : ''
        }

        await Category.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: updated }
        )
        res.redirect('/admin/categories')
    } catch (e) {
        console.log(e);
    }
}


module.exports.delete = async function (req, res) {

    try {
        const category = await Category.findById(req.params.id)
        if (category.imageSrc) {
            await toDeleteFile(category.imageSrc)
        }
        await Category.deleteOne({ _id: req.params.id })
        const products = await Product.find({ categoryId: req.params.id })
        for (let i = 0; i < products.length; i++) {
            if (products[i].imageSrc) {
                await toDeleteFile(products[i].imageSrc)
            }
        }
        await Product.deleteMany({ categoryId: req.params.id })
        res.status(200).redirect('/admin/categories')
    } catch (e) {
        console.log(e);
    }

}