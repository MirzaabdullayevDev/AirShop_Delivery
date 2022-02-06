const multer = require('multer')
const moment = require('moment')
const toDeleteFile = require('../utils/toDeleteFile')

try {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/images')
    },
    async filename(req, file, cb) {
      if (req.query.logo) {
       await toDeleteFile('/images/logo.png')
        cb(null, 'logo.png')
      } else if (req.query.logoMobile) {
        await toDeleteFile('/images/logoMobile.png')
        cb(null, 'logoMobile.png')
      } else {
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null, `${date}-${file.originalname}`)
      }
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  const limits = {
    fileSize: 1024 * 1024 * 5
  }
  module.exports = multer({ storage, fileFilter, limits })

} catch (error) {
  console.log(error);
}




