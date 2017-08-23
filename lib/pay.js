var request = require('request')
var crypto = require('crypto')
var xml2js = require('xml2js')
var builder = new xml2js.Builder({
  rootName: 'xml',
  headless: true,
  cdata: true
})

var Pay = function (options) {
  this.options = this.copyOptions(options, ['mch_id', 'wxappid', 'client_ip', 'cert', 'private_key', 'key'])
  var isPass = this.isAllExists(this.options)
  if (!isPass) {
    throw new TypeError('check the params ' + JSON.stringify(this.options))
  }
}

Pay.prototype = {
  getNonceStr: function () {
    return Math.random().toString().slice(2, 32)
  },
  getBillno: function () {
    return (Date.now() + '' + this.getNonceStr()).slice(0, 28)
  },
  getSign: function (options) {
    var keys = Object.keys(options)
    var arr = keys.map(function (key) {
      return key + '=' + options[key]
    })
    var str = arr.sort().join('&') + '&key=' + this.options.key
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
  },
  /**
  _generateOutTradeNo: function () {
    return Date.now() + '' + parseInt(Math.random() * 10000)
  },
  pay: function (options) {
    var defaultOptions = {
      nonce_str: this.getNonceStr(),
      sign: this._generateSign(),
      body: '',
      out_trade_no: this._generateOutTradeNo(),
      total_fee: 0,
      spbill_create_ip: '',
      trade_type: '',
      scene_info: ''
    }

    var URL = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    var newOptions = Object.assign({}, defaultOptions, this.options, options)
    this._checkOptions()

    var xml = builder.buildObject(newOptions)
  },
  */
  redpack: function (options, callback) {
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'
    var defaultOptions = {
      nonce_str: this.getNonceStr(),
      mch_billno: this.getBillno(),
      client_ip: this.options.client_ip,
      mch_id: this.options.mch_id,
      wxappid: this.options.wxappid
    }
    var newOptions = this.copyOptions(options, ['send_name', 're_openid', 'total_amount', 'total_num', 'wishing', 'act_name', 'remark'])
    Object.assign(newOptions, defaultOptions)
    this.copyIfExists({
      source: options,
      target: newOptions,
      fields: ['scene_id', 'risk_info', 'consume_mch_id']
    })
    var isPass = this.isAllExists(newOptions)
    if (!isPass) {
      return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
    }
    newOptions.sign = this.getSign(newOptions)
    var isNeedCert = true
    this.request(url, newOptions, isNeedCert, callback)
  },
  request: function (url, body, isNeedCert, callback) {
    var xml = builder.buildObject(body)
    var options = {
      method: 'POST',
      url: url,
      body: xml,
      headers: {
        'content-type': 'application/xml; charset=utf-8'
      }
    }
    if (isNeedCert) {
      if (this.options.pfx) {
        options.pfx = this.options.pfx
      } else {
        options.cert = this.options.cert
        options.key = this.options.private_key
      }
    }
    console.log(options)
    request(options, function (err, response, body) {
      if (err) {
        return callback(err)
      }
      xml2js.parseString(body, callback)
    })
  },
  copyOptions: function (options, fields) {
    var newOptions = {}
    fields.forEach(function (field) {
      newOptions[field] = options[field]
    })
    return newOptions
  },
  copyIfExists: function (options) {
    var source = options.source
    var target = options.target
    var fields = options.fields
    var iteration = function (field) {
      var value = source[field]
      if (this.isExists(value)) {
        target[field] = value
      }
    }
    fields.forEach(iteration.bind(this))
  },
  isAllExists: function (options) {
    var keys = Object.keys(options)
    var iteration = function (key) {
      var value = options[key]
      return this.isExists(value)
    }
    return keys.every(iteration.bind(this))
  },
  isExists: function (value) {
    return value !== null && value !== undefined && value !== '' && !(typeof value === 'number' && isNaN(value))
  }
}

module.exports = Pay