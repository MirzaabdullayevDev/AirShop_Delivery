const Product = require('../models/Product')
const Category = require('../models/Category')
const toDeleteFile = require('../utils/toDeleteFile')
const escapeRegex = require('../utils/escapeRegex')
const getPaginateForFrontend = require('../utils/getPaginateForFrontend')
module.exports.create = async function (req, res) {
    try {
        let product = new Product({
            name: req.body.name,
            cost: req.body.cost,
            imageSrc: req.file ? '/images/' + req.file.filename : '',
            categoryId: req.body.categoryId,
            caseNumber: req.body.caseNumber ? req.body.caseNumber : '',
            isExist: req.body.isExist,
            showInProductSlider: req.body.showInProductSlider,
        })
        if (req.body.priority !== '') {
            product.priority = req.body.priority
        }
        await product.save()
        res.redirect(`/admin/products/${req.body.categoryId}`)
    } catch (e) {
        console.log(e);
    }
}

module.exports.getByCategoryId = async function (req, res) {
    try {
        const category = await Category.findById(req.params.categoryId)
        let perPage = 8
        let page = req.query.page || 1
        const options = {
            page,
            sort: { name: 1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };
        const query = { categoryId: req.params.categoryId }
        const products = await Product.paginate(query, options)
        const paginate = getPaginateForFrontend(products)
        res.render('products', {
            products: products.docs,
            paginate,
            categoryId: category._id,
            categoryName: category.name,
            title: category.name
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getByProductName = async function (req, res) {
    try {
        const perPage = 8
        const page = req.query.page || 1
        const options = {
            page,
            sort: { name: 1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };
        let notFound = true
        let query = { name: '' }
        if (req.query.search !== ' ' && req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi')
            query = {
                name: regex
            }
        }
        const products = await Product.paginate(query, options)
        const paginate = getPaginateForFrontend(products)
        if (products.docs.length > 0) {
            notFound = false;
        }
        res.render('searchResults', {
            products: products.docs,
            paginate,
            searchQuery: req.query.search,
            notFound,
            title: 'Результаты поиска'
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.update = async function (req, res) {

    let updated = {
        name: req.body.name,
        cost: req.body.cost,
        categoryId: req.body.categoryId,
        isExist: req.body.isExist,
        caseNumber: req.body.caseNumber,
        showInProductSlider: req.body.showInProductSlider,
        priority: req.body.priority
    }
    try {
        if (req.file) {
            const product = await Product.findById(req.params.id)
            if (product.imageSrc) {
                await toDeleteFile(product.imageSrc)
            }
            updated.imageSrc = '/images/' + req.file.filename
        }
        await Product.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated })
        res.redirect(`/admin/products/${req.body.categoryId}`)

    } catch (e) {
        console.log(e);
    }
}

module.exports.remove = async function (req, res) {

    const product = await Product.findById(req.params.id)
    const categoryId = product.categoryId
    if (product.imageSrc) {
        await toDeleteFile(product.imageSrc)
    }
    try {
        await Product.deleteOne({ _id: req.params.id })
        res.redirect(`/admin/products/${categoryId}`)
    } catch (e) {
        console.log(e);
    }

}