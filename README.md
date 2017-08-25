# wechat-pay-api

wechat payment tool package

### Usage

```bash
npm i wechat-pay-api -S
```

```javascript
const Pay = require('wechat-pay-api')
const api = new Pay({
  wxappid: '',
  mch_id: '',
  key: '',
  pfx: '',
  client_ip: ''
})

api.payToUser({
  openid: 'user openid',
  amount: 100,
  desc: '测试付款'
}, (err, result) => {
  if (err) {
    return console.error(err)
  }
  console.log(result)
})
```

### new WechatPayApi(options)

实例化WechatPayApi，返回实例对象。

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| wxappid | string | 是 | 微信公众号appId |
| mch_id | string | 是 | 微信商户id |
| key | string | 是 | 微信商户密钥 |
| pfx | buffer | 是 | 微信商户证书，pfx格式 |
| client_ip | string | 是 | 调整支付api的机器公网ip |
| passphrase | string | 否 | 微信商户证书加密密钥，默认为mch_id |
| private_key | buffer | 否 | 微信商户私钥 |
| cert | buffer | 否 | 微信商户证书，pem格式 |

### 返回值

WechatPayApi 实例对象。

### WechatPayApi 实例对象方法

- [payToUser(options, callback) 企业付款](#paytouser)
- [getTransferInfo(options, callback) 企业付款查询](#gettransferinfo)
- [sendRedpack(options, callback) 发送普通红包](#sendredpack)
- [sendGroupRedpack(options, callback) 发送裂变红包](#sendgroupredpack)
- [getRedpackInfo(options, callback) 查询红包](#getredpackinfo)
- [sendCoupon(options, callback) 发放代金劵](#sendcoupon)
- [queryCouponStock(options, callback) 查询代金劵批次](#querycouponstock)
- [queryCouponsInfo(options, callback) 查询代金劵信息](#querycouponsinfo)

#### payToUser

企业付款。

`payToUser(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| openid | string | 是 | 用户openid |
| amount | number | 是 | 企业付款金额，单位为分 |
| desc | string | 是 | 企业付款操作说明信息。必填。 |
| check_name | string | 否 | 校验用户姓名选项<br/>NO_CHECK：不校验真实姓名 <br/>FORCE_CHECK：强校验真实姓名 |
| device_info | string | 否 | 微信支付分配的终端设备号 |
| re_user_name | string | 否 | 收款用户真实姓名。 <br/>如果check_name设置为FORCE_CHECK，<br/>则必填用户真实姓名 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| 以下字段在return_code为SUCCESS的时候有返回 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| 以下字段在return_code 和result_code都为SUCCESS的时候有返回 |
| partner_trade_no | string | 商户订单号，需保持唯一性<br/>(只能是字母或者数字，不能包含有符号) |
| payment_no | string | 企业付款成功，返回的微信订单号 |
| payment_time | string | 企业付款成功时间 |

#### getTransferInfo

查询企业付款。

`getTransferInfo(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| partner_trade_no | string | 是 | 商户调用企业付款API时使用的商户订单号 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| 以下字段在return_code为SUCCESS的时候有返回 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| 以下字段在return_code 和result_code都为SUCCESS的时候有返回 |
| detail_id | string | 调用企业付款API时，微信系统内部产生的单号 |
| status | string | 转账状态<br/>SUCCESS:转账成功<br/>FAILED:转账失败<br/>PROCESSING:处理中 |
| reason | string | 如果失败则有失败原因 |
| openid | string | 转账的openid |
| transfer_time | string | 发起转账的时间 |

#### sendRedpack

发送普通红包

`sendRedpack(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| send_name | string | 是 | 红包发送者名称 |
| re_openid | string | 是 | 接受红包的用户<br/>用户在wxappid下的openid |
| total_amount | number | 是 | 付款金额，单位分 |
| total_num | number | 是 | 红包发放总人数<br/>total_num=1 |
| wishing | string | 是 | 红包祝福语 |
| act_name | string | 是 | 活动名称 |
| remark | string | 是 | 备注信息 |
| scene_id | string | 否 | 发放红包使用场景，红包金额大于200时必传<br/>PRODUCT_1:商品促销<br/>PRODUCT_2:抽奖<br/>PRODUCT_3:虚拟物品兑奖 <br/>PRODUCT_4:企业内部福利<br/>PRODUCT_5:渠道分润<br/>PRODUCT_6:保险回馈<br/>PRODUCT_7:彩票派奖<br/>PRODUCT_8:税务刮奖 |
| risk_info | string | 否 | posttime:用户操作的时间戳<br/>mobile:业务系统账号的手机号，国家代码-手机号。不需要+号<br/>deviceid :mac 地址或者设备唯一标识 <br/>clientversion :用户操作的客户端版本。把值为非空的信息用key=value进行拼接，再进行urlencode<br/>urlencode(posttime=xx& mobile =xx&deviceid=xx) |
| consume_mch_id | string | 否 | 资金授权商户号<br/>服务商替特约商户发放时使用 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| 以下字段在return_code为SUCCESS的时候有返回 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| 以下字段在return_code 和result_code都为SUCCESS的时候有返回 |
| re_openid | string | 接受收红包的用户<br/>用户在wxappid下的openid |
| total_amount | string | 付款金额，单位分 |
| send_listid | string | 红包订单的微信单号 |

#### sendGroupRedpack

发送裂变红包

`sendGroupRedpack(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| send_name | string | 是 | 红包发送者名称 |
| re_openid | string | 是 | 接受红包的用户<br/>用户在wxappid下的openid |
| total_amount | number | 是 | 付款金额，单位分 |
| total_num | number | 是 | 红包发放总人数<br/>total_num=1 |
| amt_type | string | string | 红包金额设置方式<br/>ALL_RAND—全部随机,商户指定总金额和红包发放总人数，由微信支付随机计算出各红包金额 |
| wishing | string | 是 | 红包祝福语 |
| act_name | string | 是 | 活动名称 |
| remark | string | 是 | 备注信息 |
| scene_id | string | 否 | 发放红包使用场景，红包金额大于200时必传<br/>PRODUCT_1:商品促销<br/>PRODUCT_2:抽奖<br/>PRODUCT_3:虚拟物品兑奖 <br/>PRODUCT_4:企业内部福利<br/>PRODUCT_5:渠道分润<br/>PRODUCT_6:保险回馈<br/>PRODUCT_7:彩票派奖<br/>PRODUCT_8:税务刮奖 |
| risk_info | string | 否 | posttime:用户操作的时间戳<br/>mobile:业务系统账号的手机号，国家代码-手机号。不需要+号<br/>deviceid :mac 地址或者设备唯一标识 <br/>clientversion :用户操作的客户端版本。把值为非空的信息用key=value进行拼接，再进行urlencode<br/>urlencode(posttime=xx& mobile =xx&deviceid=xx) |
| consume_mch_id | string | 否 | 资金授权商户号<br/>服务商替特约商户发放时使用 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| 以下字段在return_code为SUCCESS的时候有返回 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| 以下字段在return_code 和result_code都为SUCCESS的时候有返回 |
| total_amount | string | 付款总金额，单位分 |
| send_listid | string | 微信红包订单号 |
| re_openid | string | 接受收红包的用户<br/>用户在wxappid下的openid |

#### getRedpackInfo

查询红包记录

`getRedpackInfo(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| mch_billno | string | 是 | 商户发放红包的商户订单号 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| 以下字段在return_code为SUCCESS的时候有返回 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| 以下字段在return_code 和result_code都为SUCCESS的时候有返回 |
| detail_id | string | 使用API发放现金红包时返回的红包单号 |
| status | string | SENDING:发放中 <br/>SENT:已发放待领取 <br/>FAILED：发放失败 <br/>RECEIVED:已领取 <br/>RFUND_ING:退款中 <br/>REFUND:已退款 |
| send_type | string | API:通过API接口发放 <br/>UPLOAD:通过上传文件方式发放 <br/>ACTIVITY:通过活动方式发放 |
| hb_type | string | GROUP:裂变红包 <br/>NORMAL:普通红包 |
| total_num | string | 红包个数 |
| total_amount | string | 红包总金额（单位分） |
| reason | string | 发送失败原因 |
| send_time | string | 红包发送时间 |
| refund_time | string | 红包的退款时间（如果其未领取的退款） |
| refund_amount | string | 红包退款金额 |
| wishing | string | 祝福语 |
| hblist | object | 裂变红包的领取列表 |
| openid | string | 领取红包的openid |
| amount | string | 领取金额 |
| rcv_time | string | 领取红包的时间 |

#### sendCoupon

发放代金劵

`sendCoupon(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| coupon_stock_id | string | 是 | 代金券批次id |
| openid | string | 是 | Openid信息，用户在appid下的openid。 |
| op_user_id | string | 否 | 操作员帐号, 默认为商户号 <br/>可在商户平台配置操作员对应的api权限 |
| device_info | string | 否 | 微信支付分配的终端设备号 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| coupon_stock_id | string | 代金券批次id |
| resp_count | string | 返回记录数 |
| success_count	| string | 成功记录数 |
| failed_count | string | 失败记录数 |
| openid | string | 用户在商户appid下的唯一标识 |
| ret_code | string | 返回码，SUCCESS/FAILED |
| coupon_id | string | 对一个用户成功发放代金券则返回代金券id，即ret_code为SUCCESS的时候；<br/>如果ret_code为FAILED则填写空串"" |
| ret_msg | string | 返回信息，当返回码是FAILED的时候填写，否则填空串“” |

#### queryCouponStock

查询代金劵批次

`queryCouponStock(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| coupon_stock_id | string | 是 | 代金券批次id |
| op_user_id | string | 否 | 操作员帐号, 默认为商户号 <br/>可在商户平台配置操作员对应的api权限 |
| device_info | string | 否 | 微信支付分配的终端设备号 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| coupon_stock_id | string | 代金券批次id |
| coupon_name | string | 代金券名称 |
| coupon_value | string | 代金券面值,单位是分 |
| coupon_mininumn | string | 代金券使用最低限额,单位是分 |
| coupon_stock_status | string | 批次状态： 1-未激活；2-审批中；4-已激活；8-已作废；16-中止发放； |
| coupon_total | string | 代金券数量 |
| max_quota | string | 代金券每个人最多能领取的数量, 如果为0，则表示没有限制 |
| is_send_num | string | 代金券已经发送的数量 |
| begin_time | string | 生效开始时间,格式为时间戳 |
| end_time | string | 生效结束时间,格式为时间戳 |
| create_time	| string | 创建时间,格式为时间戳 |
| coupon_budget | string | 代金券预算额度 |

#### queryCouponsInfo

查询代金劵信息

`queryCouponsInfo(options, callback)`

#### options 对象属性

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| coupon_id | string | 是 | 代金券id |
| openid | string | 是 | Openid信息，用户在appid下的openid。 |
| stock_id | string | 是 | 代金劵对应的批次号 |
| op_user_id | string | 否 | 操作员帐号, 默认为商户号 <br/>可在商户平台配置操作员对应的api权限 |
| device_info | string | 否 | 微信支付分配的终端设备号 |

#### 回调参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | error | 错误对象 |
| result | object | 结果对象 |

#### result 结果对象属性

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| return_code | string | SUCCESS/FAIL<br/>此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断 |
| return_msg | string | 返回信息，如非空，为错误原因<br/>签名失败<br/>参数格式校验错误 |
| result_code | string | 业务结果<br/>SUCCESS/FAIL |
| coupon_stock_id | string | 代金券批次id |
| coupon_id | string | 代金券id |
| coupon_name | string | 代金券名称 |
| coupon_value | string | 代金券面值,单位是分 |
| coupon_mininumn | string | 代金券使用最低限额,单位是分 |
| coupon_state | string | 代金券状态：SENDED-可用，USED-已实扣，EXPIRED-已过期 |
| coupon_desc | string | 代金券描述 |
| coupon_use_value | string | 代金券实际使用金额 |
| coupon_remain_value | string | 代金券剩余金额：部分使用情况下，可能会存在券剩余金额 |
| begin_time | string | 生效开始时间,格式为时间戳 |
| end_time | string | 生效结束时间,格式为时间戳 |
| send_time | string | 发放时间,格式为时间戳 |
| send_source | string | 代金券发放来源：FULL_SEND-满送 NORMAL-普通发放场景 |
| is_partial_use | string | 该代金券是否允许部分使用标识：1-表示支持部分使用 |