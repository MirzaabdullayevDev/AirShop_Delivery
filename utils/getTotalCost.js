module.exports = function (list) {
    var totalCost = 0

    for (let i = 0; i < list.length; i++) {
        totalCost += list[i].cost * list[i].count
    }
    return totalCost
}