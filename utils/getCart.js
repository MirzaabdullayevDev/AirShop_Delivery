const getTotalCost=require('../utils/getTotalCost')
module.exports = function (cart) {
    let newList = []
    for (let i = 0; i < cart.list.length; i++) {
        const _id=cart.list[i].productId._id
        const name = cart.list[i].productId.name
        const cost = cart.list[i].productId.cost
        const count = cart.list[i].count
        const categoryId = cart.list[i].productId.categoryId
        const imageSrc = cart.list[i].productId.imageSrc
        const isExist = cart.list[i].productId.isExist
        const caseNumber = cart.list[i].productId.caseNumber
        const sum = cost * count

        newList.push({ _id,name, cost, count, categoryId, imageSrc, isExist, caseNumber, sum })
    }
    const countProducts=newList.length
    const totalCost=getTotalCost(newList)
    const newCart={list:newList,countProducts,totalCost}
    return newCart
}