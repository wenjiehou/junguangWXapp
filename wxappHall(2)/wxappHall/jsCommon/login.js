
var checked = false;

//非授权
var noAuthCheck = function(callObj) {
  var temp = this;
  var wxkey = wx.getStorageSync("wxkey"); 
  if (!wxkey) { //wxkey不存在
    this.reqWxkey(callObj);
  } else { //验证wxkey是否过期
    wx.request({
      url: 'https://ju.giantfun.cn/v1/session/verify', //仅为示例，并非真实的接口地址
      data: {
        'wxkey': wxkey
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          if (res.data.session == 1) { //过期
            temp.reqWxkey(callObj);
          }else{
            callObj.complete({ wxkey: wxkey });
          }
        }else{
          temp.reqWxkey(callObj);
        }
      }
    })
  }
}

var reqWxkey = function(callObj) {

  wx.login({
    success: function(data) {
      console.log("ddddddasdasasd::", data.code);
      wx.request({
        url: 'https://ju.giantfun.cn/v1/login', //仅为示例，并非真实的接口地址
        data: {
          code: data.code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log("reqWxkey", res.data);
          if (res.data.code == 0) {
            wx.setStorageSync("wxkey", res.data.data);
            callObj.complete({ wxkey: res.data.data});
          }
        }
      })
    }
  })
}



var auth = false;

//验证用户是否授权
var authCheck = function(callObj) {
  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/auth/verify', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      console.log("authCheck", res.data);
      if (res.data.code == 0) {
        if (res.data.auth == 0) {
          temp.auth = true;
        } else {
          temp.auth = false;
        }

        callObj.complete({
          auth: temp.auth
        });
        temp.checked = true;
      }
    }
  })
}

module.exports = {
  reqWxkey: reqWxkey,
  noAuthCheck: noAuthCheck,
  auth: auth,
  authCheck: authCheck,
  checked: checked
};