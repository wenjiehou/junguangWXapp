//除了基本的登录网络请求，其余的都在这里
var config = require("./config.js");

var getSignData = function (callback) {
  var temp = this;
  wx.request({
    url: config.getSignData, //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("getSignData", res);
      if (res.data.code == 0) {
        if (callback && callback.complete) {
          callback.complete(res.data.data);
        }
      }
    }
  })
}

var getCredit = function (callback) {
  var temp = this;
  wx.request({
    url: config.getCredit, //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      // console.log("getCredit", res);
      if (res.data.code == 0) {
        if (callback && callback.complete) {
          callback.complete(res.data.data);
        }
      }
    }
  })
}


var reqSign = function (callObj) {//
  var temp = this;
  wx.request({
    url: config.reqSign,
    data: {
      wxkey: wx.getStorageSync("wxkey")
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },

    success: function (res) {
      console.log("reqSign....", res);
      if (res.data.code == 0) {
        if (callObj && callObj.complete) {
          callObj.complete(res.data.data);
        }
      }
    }
  })

}

var signRecom = function (callObj) {//
  var temp = this;
  wx.request({
    url: config.signRecom,
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      formId: callObj.formId,
      recomTime: callObj.recomTime,
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },

    success: function (res) {
      console.log("signRecom....", res);
      if (res.data.code == 0) {
        if (callObj && callObj.complete) {
          callObj.complete(res.data.data);
        }
      }
    }
  })

}





module.exports = {
  getSignData: getSignData,
  getCredit: getCredit,
  reqSign: reqSign,
  signRecom: signRecom,
}