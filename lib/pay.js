var request = require('request')
var timeFormater = require('time-formater')
var crypto = require('crypto')
var xml2js = require('xml2js')
var parser = new xml2js.Parser({
    explicitArray: false,
    explicitRoot: false,
    trim: true
})
var builder = new xml2js.Builder({
    rootName: 'xml',
    headless: true,
    cdata: true
})

var Pay = function (options) {
    this.options = this.copyOptions(options, ['mch_id', 'wxappid', 'client_ip', 'key'])
    if (options.pfx) {
        this.options.pfx = options.pfx
        this.options.passphrase = options.passphrase || options.mch_id
    } else {
        this.options.cert = options.cert
        this.options.private_key = options.private_key
    }
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
    getPartnerTradeNo: function () {
        return this.options.mch_id + timeFormater().format('YYYYMMDD') + parseInt(Math.random() * 899999 + 100000)
    },
    getSign: function (options) {
        var keys = Object.keys(options)
        var arr = keys.map(function (key) {
            return key + '=' + options[key]
        })
        var str = arr.sort().join('&') + '&key=' + this.options.key
        return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
    },
    sendRedpack: function (options, callback) {
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
    sendGroupRedpack: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack'
        var defaultOptions = {
            nonce_str: this.getNonceStr(),
            mch_billno: this.getBillno(),
            client_ip: this.options.client_ip,
            mch_id: this.options.mch_id,
            wxappid: this.options.wxappid
        }
        var newOptions = this.copyOptions(options, ['send_name', 're_openid', 'total_amount', 'total_num', 'amt_type', 'wishing', 'act_name', 'remark'])
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
    getRedpackInfo: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo'
        var newOptions = {
            nonce_str: this.getNonceStr(),
            mch_id: this.options.mch_id,
            appid: this.options.wxappid,
            bill_type: 'MCHT',
            mch_billno: options.mch_billno
        }
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = true
        this.request(url, newOptions, isNeedCert, callback)
    },
    payToUser: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers'
        var defaultOptions = {
            mch_appid: this.options.wxappid,
            mchid: this.options.mch_id,
            nonce_str: this.getNonceStr(),
            partner_trade_no: this.getBillno(),
            check_name: options.check_name || 'NO_CHECK',
            spbill_create_ip: this.options.client_ip
        }
        var newOptions = this.copyOptions(options, ['openid', 'amount', 'desc'])
        Object.assign(newOptions, defaultOptions)
        this.copyIfExists({
            source: options,
            target: newOptions,
            fields: ['device_info', 're_user_name']
        })
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            console.log(newOptions)
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = true
        this.request(url, newOptions, isNeedCert, callback)
    },
    getTransferInfo: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo'
        var newOptions = {
            nonce_str: this.getNonceStr(),
            appid: this.options.appid,
            mch_id: this.options.mch_id,
            partner_trade_no: options.partner_trade_no
        }
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = true
        this.request(url, newOptions, isNeedCert, callback)
    },
    sendCoupon: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/send_coupon'
        var defaultOptions = {
            openid_count: 1,
            partner_trade_no: this.getPartnerTradeNo(),
            appid: this.options.appid,
            mch_id: this.options.mch_id,
            nonce_str: this.getNonceStr()
        }
        var newOptions = this.copyOptions(options, ['coupon_stock_id', 'openid'])
        Object.assign(newOptions, defaultOptions)
        this.copyIfExists({
            source: options,
            target: newOptions,
            fields: ['op_user_id', 'device_info']
        })
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = true
        this.request(url, newOptions, true, callback)
    },
    queryCouponStock: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/query_coupon_stock'
        var newOptions = {
            appid: this.options.appid,
            mch_id: this.options.mch_id,
            nonce_str: this.getNonceStr(),
            coupon_stock_id: options.coupon_stock_id
        }
        this.copyIfExists({
            source: options,
            target: newOptions,
            fields: ['op_user_id', 'device_info']
        })
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = false
        this.request(url, newOptions, isNeedCert, callback)
    },
    queryCouponsInfo: function (options, callback) {
        var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/querycouponsinfo'
        var defaultOptions = {
            appid: this.options.appid,
            mch_id: this.options.mch_id,
            nonce_str: this.getNonceStr()
        }
        var newOptions = this.copyOptions(options, ['coupon_id', 'openid', 'stock_id'])
        Object.assign(newOptions, defaultOptions)
        this.copyIfExists({
            source: options,
            target: newOptions,
            fields: ['op_user_id', 'device_info']
        })
        var isPass = this.isAllExists(newOptions)
        if (!isPass) {
            return callback(new TypeError('check the params ' + JSON.stringify(newOptions)))
        }
        newOptions.sign = this.getSign(newOptions)
        var isNeedCert = false
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
                options.passphrase = this.options.passphrase
            } else {
                options.cert = this.options.cert
                options.key = this.options.private_key
            }
        }
        request(options, function (err, response, body) {
            if (err) {
                return callback(err)
            }
            parser.parseString(body, callback)
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