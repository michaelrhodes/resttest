var template = 'http://resttest.bench.co/transactions/:page.json'

module.exports = function (number) {
  return template.replace(':page', number)
}
