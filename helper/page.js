const page = (page, limit) => {
    let pagePage = (page) ? page : 1
    let pageLimit = limit

    let result = {
        page: pagePage,
        limit: pageLimit,
        offset: (pagePage * pageLimit) - pageLimit
    }

    return result
}

module.exports = page
