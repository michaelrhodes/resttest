module.exports = function (url, cb) {
  var xhr = new XMLHttpRequest
  xhr.open('GET', url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return

    xhr.status >= 200 && xhr.status <= 304 ?
      cb(null, JSON.parse(xhr.responseText)) :
      cb(new Error(xhr.responseText || 'Unknown error'))
  }
  xhr.send()
}
