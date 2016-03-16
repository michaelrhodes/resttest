module.exports = function (amount) {
  var symbol = amount < 0 ? '-$' : '$'  
  var number = Math.abs(amount).toFixed(2)
  return symbol + number
}
