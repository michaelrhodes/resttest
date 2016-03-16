var model = require('./model')()
var view = require('./view')()
var mount = document.querySelector('.mount-point')

// So we can pass it to Array.prototype.forEach
view.addTransaction = view.addTransaction.bind(view)

model.on('update:transactions', function (transactions) {
  transactions.forEach(view.addTransaction)

  if (view.dom.parentNode !== mount) {
    mount.removeAttribute('data-loading')
    mount.appendChild(view.dom)
  }
})

model.on('update:balance', function (balance) {
  view.updateBalance(balance)
})

model.on('update:error', function (error) {
  console.error(error)
})

mount.setAttribute('data-loading', true)
model.update()
