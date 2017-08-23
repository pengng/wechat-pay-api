var WechatPay = require('../lib/pay')
var assert = require('assert')

describe('test pay.js', function () {
  it('test isAllExists()', function () {
    var options = {
      wxappid: 'wx2c48fd72adc06d73',
      mch_id: '1268665301',
      client_ip: '120.76.140.213'
    }
    var isPass = WechatPay.prototype.isAllExists(options)
    assert(isPass)
  })
})