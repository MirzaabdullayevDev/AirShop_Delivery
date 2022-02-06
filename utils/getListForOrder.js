module.exports=function(list){
    
    const listForOrder=list.map(item=>({
        name:item.name,
        cost:item.cost,
        count:item.count,
        sum:item.sum
    }))
    return listForOrder;
}