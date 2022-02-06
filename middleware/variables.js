module.exports=function(req,res,next){
    res.locals.isAuth=req.session.isAuthenticated
    if(req.session.user){
        res.locals.userName = req.session.user.name
    }
    res.locals.isAdmin = req.session.isAdmin
    if(req.session.admin){
        res.locals.adminName = req.session.admin.name
    }
    next();
}