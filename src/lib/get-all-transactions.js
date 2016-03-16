var url = require('./get-page-url')
var json = require('./get-json')

module.exports = function (cb) {
  var transactions = []
  var lastPage = 1

  ;(function page (number) {
    json(url(number), function (err, data) {
      if (err) return cb(err)

      // Calculate the total number of pages
      if (data.page === 1) {
        lastPage = Math.ceil(
          data.totalCount /
          data.transactions.length
        )
      }

      // Append new transactions
      transactions = transactions.concat(
        data.transactions
      )

      data.page === lastPage ?
        cb(null, transactions) :
        page(data.page + 1)
    })
  })(1)
}
