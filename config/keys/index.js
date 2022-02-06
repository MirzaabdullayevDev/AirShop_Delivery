if(process.env.NODE_ENV==='production'){
    module.exports=require('../keys/keys.prod')
}else{
    module.exports=require('../keys/keys.dev')
}