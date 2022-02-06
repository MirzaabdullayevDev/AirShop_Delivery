module.exports = function (paginateResult) {
    if(paginateResult.totalDocs<=paginateResult.limit){
        return {}
    }
    const pageNumbers = []
    let i = paginateResult.page > 5 ? paginateResult.page - 4 : 1
    for (; i <= paginateResult.page + 4 && i <= paginateResult.totalPages; i++) {
        let obj = {}
        if (i === paginateResult.page) {
            obj = {
                page: i,
                active: true
            }
        } else {
            obj = {
                page: i
            }
        }
        pageNumbers.push(obj);
    }

    const paginate = {
        totalDocs: paginateResult.totalDocs,
        totalPages: paginateResult.totalPages,
        page: paginateResult.page,
        hasNextPage: paginateResult.hasNextPage,
        hasPrevPage: paginateResult.hasPrevPage,
        prevPage: paginateResult.prevPage,
        nextPage: paginateResult.nextPage,
        pageNumbers
    }
    return paginate
}