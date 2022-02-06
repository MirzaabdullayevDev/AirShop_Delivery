module.exports = function(req,res){
    res.status(404).render('error404',{
        title:'Страница не найдена'
    })
}