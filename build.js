(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
var format = require("format-text");
var leftpad = require("left-pad");
var days = require("days");
var months = require("months");

module.exports = formatDate;

function formatDate (template, date) {
  if (!date) date = new Date;

  return format(template, {
    day: leftpad(date.getDate(), 2, '0'),
    month: leftpad(date.getMonth() + 1, 2, '0'),
    year: date.getFullYear(),
    hours: leftpad(date.getHours(), 2, '0'),
    minutes: leftpad(date.getMinutes(), 2, '0'),
    seconds: leftpad(date.getSeconds(), 2, '0'),
    'day-name': days[date.getDay()],
    'month-name': months[date.getMonth()],
    'month-abbr-name': months.abbr[date.getMonth()],

    // utc
    'utc-day': leftpad(date.getUTCDate(), 2, '0'),
    'utc-month': leftpad(date.getUTCMonth() + 1, 2, '0'),
    'utc-year': date.getUTCFullYear(),
    'utc-hours': leftpad(date.getUTCHours(), 2, '0'),
    'utc-minutes': leftpad(date.getUTCMinutes(), 2, '0'),
    'utc-seconds': leftpad(date.getUTCSeconds(), 2, '0'),
    'utc-day-name': days[date.getUTCDay()],
    'utc-month-name': months[date.getUTCMonth()],
    'utc-month-abbr-name': months.abbr[date.getUTCMonth()]
  });
}

},{"days":3,"format-text":4,"left-pad":5,"months":6}],3:[function(require,module,exports){
/*!
 * days <https://github.com/jonschlinkert/days>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

module.exports = ['Sunday', 'Monday', 'Tuesday', 'Wendesday', 'Thursday', 'Friday', 'Saturday'];
},{}],4:[function(require,module,exports){
module.exports = format;

function format(text) {
  var context;

  if (typeof arguments[1] == 'object' && arguments[1]) {
    context = arguments[1];
  } else {
    context = Array.prototype.slice.call(arguments, 1);
  }

  return String(text).replace(/\{?\{([^{}]+)}}?/g, replace(context));
};

function replace (context, nil){
  return function (tag, name) {
    if (tag.substring(0, 2) == '{{' && tag.substring(tag.length - 2) == '}}') {
      return '{' + name + '}';
    }

    if (!context.hasOwnProperty(name)) {
      return tag;
    }

    if (typeof context[name] == 'function') {
      return context[name]();
    }

    return context[name];
  }
}

},{}],5:[function(require,module,exports){
module.exports = leftpad;

function leftpad (str, len, ch) {
  str = String(str);

  var i = -1;

  ch || (ch = ' ');
  len = len - str.length;


  while (++i < len) {
    str = ch + str;
  }

  return str;
}

},{}],6:[function(require,module,exports){
/*!
 * months <https://github.com/jonschlinkert/months>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

module.exports = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports.abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

},{}],7:[function(require,module,exports){
var shared = require('./shared')
module.exports = function(html) {
  return shared(html, document)
}

},{"./shared":8}],8:[function(require,module,exports){
var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
}
 
module.exports = function(html, document) {
  html = html.replace(/(^[^<]*|[^>]*$)/, '')
  var tag = (html.match(/^<([a-z]+)/i) || []).slice(1)[0]
  var wrap = map[tag] || map._default
  var depth = wrap[0]
  var prefix = wrap[1]
  var suffix = wrap[2]

  html = prefix + html + suffix

  // Custom nodeName ‘cause we can.
  dom = document.createElement('mkdom')
  dom.innerHTML = html

  // Return loose elements inside <domify> wrapper
  var children = dom.childNodes
  var elementCount = 0
  for (var i = 0, l = children.length; i < l; i++)
    if (children[i].nodeType == 3 && ++elementCount > 1)
      return dom

  // Return enclosed elements without <domify> wrapper
  var element = dom.firstChild
  while (depth--) {
    element = element.firstChild  
  }
  return element
}

},{}],9:[function(require,module,exports){
module.exports = function(node, value) {
  var text = (node.textContent !== undefined ?
    'textContent' : 'innerText'
  )

  if (typeof value != 'undefined') {
    node[text] = value
  }

  return node[text]
}

},{}],10:[function(require,module,exports){
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

},{"./model":16,"./view":17}],11:[function(require,module,exports){
module.exports = function (amount) {
  var symbol = amount < 0 ? '-$' : '$'  
  var number = Math.abs(amount).toFixed(2)
  return symbol + number
}

},{}],12:[function(require,module,exports){
var format = require('format-date')
var pattern = '{month-abbr-name} {day}, {year}'

module.exports = function (date) {
  return format(pattern, date)
}

},{"format-date":2}],13:[function(require,module,exports){
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

},{"./get-json":14,"./get-page-url":15}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
var template = 'http://resttest.bench.co/transactions/:page.json'

module.exports = function (number) {
  return template.replace(':page', number)
}

},{}],16:[function(require,module,exports){
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

},{"./lib/format-amount":11,"./lib/format-date":12,"./lib/get-all-transactions":13,"emitter-component":1}],17:[function(require,module,exports){

var text = require('text-content')
var mkdom = require('mkdom')

// Grab template strings
var table = "<table class=\"transactions-table\">\n  <thead></thead>\n  <tbody></tbody>\n</table>\n"
var header = "<tr>\n  <th>Date</th>\n  <th>Company</th>\n  <th>Account</th>\n  <th class=\"amount\"></th>\n</tr>\n"

// We only clone rows, so precache a DOM representation
var row = mkdom("<tr class=\"transaction\">\n  <td class=\"date\"></td>\n  <td class=\"company\"></td>\n  <td class=\"account\"></td>\n  <td class=\"amount\"></td>\n</tr>\n")

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

},{"mkdom":7,"text-content":9}]},{},[10]);
