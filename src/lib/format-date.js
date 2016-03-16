var format = require('format-date')
var pattern = '{month-abbr-name} {day}, {year}'

module.exports = function (date) {
  return format(pattern, date)
}
