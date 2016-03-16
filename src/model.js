var emitter = require('emitter-component')
var transactions = require('./lib/get-all-transactions')
var formatDate = require('./lib/format-date')
var formatAmount = require('./lib/format-amount')

function Model () {
  if (!(this instanceof Model)) {
    return new Model
  }

  this.transactions = null
  this.balance = null
}

emitter(Model.prototype)

Model.prototype.update = function () {
  transactions(function (err, list) {
    if (err) return this.emit('update:error', err)

    this.transactions = list
    this.balance = list.reduce(add, 0)

    this.emit('update:transactions', this.transactions.map(format))
    this.emit('update:balance', formatAmount(this.balance))
  }.bind(this))
}

function format (tr, i) {
  var transaction = {}
  transaction.date = formatDate(new Date(tr.Date))
  transaction.company = tr.Company
  transaction.account = tr.Ledger
  transaction.amount = formatAmount(parseFloat(tr.Amount))
  return transaction
}

function add (total, transaction) {
  return total + parseFloat(transaction.Amount)
}

module.exports = Model
