
var payObj = {};

var payFun = function () {
  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/wxpay/pay', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("pay....", res);
      if (res.data.code == 0) {
        temp.payObj = res.data;

        wx.requestPayment({
          timeStamp: temp.payObj.timeStamp,
          nonceStr: temp.payObj.nonceStr,
          package: temp.payObj.package,
          signType: temp.payObj.signType,
          paySign: temp.payObj.paySign,

          success: function (res) {
            console.log("支付成功", res);
          },

          fail: function (res) {
            console.log("支付失败", res);
          }

        })
      }


    }
  })
}

module.exports = {
  payObj:payObj,
  payFun: payFun

}
