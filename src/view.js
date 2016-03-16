var fs = require('fs')
var text = require('text-content')
var mkdom = require('mkdom')

// Grab template strings
var table = fs.readFileSync('src/partial/table/index.html', 'utf8')
var header = fs.readFileSync('src/partial/table/header.html', 'utf8')

// We only clone rows, so precache a DOM representation
var row = mkdom(fs.readFileSync('src/partial/table/row.html', 'utf8'))

function View () {
  if (!(this instanceof View)) {
    return new View
  }

  this.dom = mkdom(table)
  this.header = mkdom(header)

  this.thead = this.dom.querySelector('thead')
  this.tbody = this.dom.querySelector('tbody')
  this.balance = this.header.querySelector('.amount')

  this.thead.appendChild(this.header)
}

View.prototype.updateBalance = function (balance) {
  text(this.balance, balance)
}

View.prototype.addTransaction = function (trans) {
  var el = row.cloneNode(true)
  text(el.querySelector('.date'), trans.date)
  text(el.querySelector('.company'), trans.company)
  text(el.querySelector('.account'), trans.account)
  text(el.querySelector('.amount'), trans.amount)
  this.tbody.appendChild(el)
}

module.exports = View
