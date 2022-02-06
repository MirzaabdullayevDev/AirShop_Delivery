const Info = require('../models/Info');
const Contacts = require('../models/Contacts')
module.exports.getCreateOrEditInfoPage = async function (req, res) {
    const info = await Info.findOne()
    if (req.query.pageName === 'about-us') {
        res.render('info/createOrEditInfoPage', {
            layout:'admin',
            text: info ? info.aboutUs : 'empty',
            pageName: req.query.pageName,
            title: 'Управление информациями'
        })
    }

    if (req.query.pageName === 'agreement') {
        res.render('info/createOrEditInfoPage', {
            layout:'admin',
            text: info ? info.agreement : 'empty',
            pageName: req.query.pageName,
            title: 'Управление информациями'
        })
    }

    if (req.query.pageName === 'contacts') {
        res.render('info/createOrEditInfoPage', {
            layout:'admin',
            text: info ? info.contacts : 'empty',
            pageName: req.query.pageName,
            title: 'Управление информациями'
        })
    }

    if (req.query.pageName === 'faq') {
        res.render('info/createOrEditInfoPage', {
            layout:'admin',
            text: info ? info.faq : 'empty',
            pageName: req.query.pageName,
            title: 'Управление информациями'
        })
    }
}

module.exports.createOrEdit = async function (req, res) {
    let info = await Info.findOne()
    let ref = ''
    if (info) {
        const updated = {}
        if (req.body.pageName === 'about-us') {
            updated.aboutUs = req.body.text
            ref = '/info/about-us'
        }

        if (req.body.pageName === 'agreement') {
            updated.agreement = req.body.text
            ref = '/info/agreement'
        }

        if (req.body.pageName === 'contacts') {
            updated.contacts = req.body.text
            ref = '/info/contacts'
        }

        if (req.body.pageName === 'faq') {
            updated.faq = req.body.text
            ref = '/info/faq'
        }
        await Info.findOneAndUpdate({}, { $set: updated })
    } else {
        info = new Info()
        if (req.body.pageName === 'about-us') {
            info.aboutUs = req.body.text
            ref = '/info/about-us'
        }

        if (req.body.pageName === 'agreement') {
            info.agreement = req.body.text
            ref = '/info/agreement'
        }

        if (req.body.pageName === 'contacts') {
            info.contacts = req.body.text
            ref = '/info/contacts'
        }

        if (req.body.pageName === 'faq') {
            info.faq = req.body.text
            ref = '/info/faq'
        }
        await info.save()
    }

    res.redirect(ref)
}

module.exports.aboutUs = async function (req, res) {
    const info = await Info.findOne().select('aboutUs')
    let layout = 'info'
    if (req.session.isAdmin) {
        layout = 'admin'
    }
    res.render('info/aboutUs', {
        layout,
        text: info ? info.aboutUs : 'empty',
        title: 'О нас'
    })
}

module.exports.agreement = async function (req, res) {
    const info = await Info.findOne().select('agreement')
    let layout = 'info'
    if (req.session.isAdmin) {
        layout = 'admin'
    }
    res.render('info/agreement', {
        layout,
        text: info ? info.agreement : 'empty',
        title: 'Пользовательское соглашение'
    })
}

module.exports.contacts = async function (req, res) {
    let layout = 'info'
    if (req.session.isAdmin) {
        layout = 'admin'
    }
    const info = await Info.findOne().select('contacts')
    res.render('info/contacts', {
        layout,
        text: info ? info.contacts : 'empty',
        title: 'Контакты'
    })
}

module.exports.instruction = async function (req, res) {
    let layout = 'info'
    if (req.session.isAdmin) {
        layout = 'admin'
    }
    res.render('info/instruction', {
        layout,
        title: 'Как заказать?'
    })
}

module.exports.getContactsAsJSON = async function (req, res) {
    const contacts = await Contacts.findOne()
    res.status(200).json(contacts)
}