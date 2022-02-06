module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        if (req.query.fromAxios) {
            res.json({
                message:'Unauthorized'
            })
        } else {
            return res.redirect('/auth/login')
        }
    } else {
        next()
    }
}