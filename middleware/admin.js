module.exports = function (req, res, next) {
    if (!req.session.isAdmin) {
        if (req.query.fromAxios) {
            res.json({
                message:'Unauthorized'
            })
        } else {
            return res.redirect('/admin/login')
        }
    }
    next();
}