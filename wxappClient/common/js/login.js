var app = getApp();
var config = require("./config.js");

var preLogin = function (callObj){
  var temp = this;
  var wxkey = wx.getStorageSync("wxkey");
  if (!wxkey) {//wxkey不存在
  //这里就不需要checkSession，直接登录就好
    reqWxkey(callObj);
  }else{
    wx.checkSession({
      success:function(){
        //session_key 未过期
        callObj.complete({ wxkey: wxkey });
      },
      fail:function(){
        // session_key 已经失效
        reqWxkey(callObj);
      }
    })
  }
}

//这里是请求登录的，会带上玩家的信息
var login = function(callObj){//
  var temp = this;
  wx.request({
    url: config.login,
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      userInfo: getApp().globalData.userInfo,
      rawData: getApp().globalData.rawData,
      signature: getApp().globalData.signature,
      encryptedData: getApp().globalData.encryptedData,
      iv: getApp().globalData.iv
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },

    success: function (res) {
      console.log("login....", res);
      if (res.data.code == 0) {
        if (callObj && callObj.complete) {
          callObj.complete(res.data.data);
        }
      }
    }
  })

}

var reqWxkey = function(callObj){//没有登录过肯定要login要code
var temp = this;
  wx.login({
    success:function(data){
      console.log("wx.login():data:", data.code);
      wx.request({
        url: config.preLogin, //仅为示例，并非真实的接口地址
        data: {
          code: data.code
        },
        method: "GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("reqWxkey", res);
          if (res.data.code == 0) {
            wx.setStorageSync("wxkey", res.data.data);
            callObj.complete({ wxkey: res.data.data });
          }
        }
      })
    }
  });
}

module.exports = {
  preLogin:preLogin,
  login: login
}






