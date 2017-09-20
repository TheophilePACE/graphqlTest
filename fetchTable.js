const fetchTableToJson = (fetch, urlTable) =>
    urlTable.map(url =>
        fetch(url)
        .then(r => r.json())
    )

const makeFlatFetchTableToJson = fetch => urlTable => Promise.all(fetchTableToJson(fetch, urlTable))

const flatFetchTableToJson = urlTable => Promise.all(fetchTableToJson(fetch, urlTable))


module.exports = { makeFlatFetchTableToJson, fetchTableToJson }