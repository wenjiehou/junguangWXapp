var app = getApp();
var config = require("./config.js");

var preLogin = function (callObj) {
  var temp = this;
  var wxkey = wx.getStorageSync("wxkey");//后面升级版本的时候，先把这个干掉，强制重新登录
  if (!wxkey) {//wxkey不存在
    //这里就不需要checkSession，直接登录就好
    reqWxkey(callObj);
  } else {
    wx.checkSession({
      success: function () {
        //session_key 未过期
        callObj.complete({ wxkey: wxkey });
      },
      fail: function () {
        // session_key 已经失效
        reqWxkey(callObj);
      }
    })
  }
}

//这里是请求登录的，会带上玩家的信息
var login = function (callObj) {//
  var temp = this;
  var loginParam = wx.getLaunchOptionsSync().query;//获取用户的启动数据，

  //判断这个人是不是从朋友分享

  var fromUserId = 0;//表示没有人推荐

  if (loginParam.fromUserId != undefined){
    fromUserId = loginParam.fromUserId
  }

  console.log("wxkey::", wx.getStorageSync("wxkey"));
  wx.request({
    url: config.login,
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      userInfo: getApp().globalData.userInfo,
      rawData: getApp().globalData.rawData,
      signature: getApp().globalData.signature,
      encryptedData: getApp().globalData.encryptedData,
      iv: getApp().globalData.iv,
      fromUserId: parseInt(fromUserId) ,
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },

    success: function (res) {
      config.tryLoginNum += 1
      console.log("login....", res);
      if (res.data.code == 0) {
        if (callObj && callObj.complete) {
          callObj.complete(res.data.data);
        }
      } else {//wxkey不对了,重新获取
        if (config.tryLoginNum >= 2){
          return
        }
        reqWxkey({
          complete: function () {//重新获取好了再来一次
            //这个时候需要重新getuserinfo
            wx.getUserInfo({
              success:function(res){
                getApp().globalData.userInfo = res.userInfo
                getApp().globalData.rawData = res.rawData
                getApp().globalData.signature = res.signature
                getApp().globalData.encryptedData = res.encryptedData
                getApp().globalData.iv = res.iv
                login(callObj)
              }
            })
          }
        })
      }
    }
  })

}

var reqWxkey = function (callObj) {//没有登录过肯定要login要code
  var temp = this;
  wx.login({
    success: function (data) {
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
  preLogin: preLogin,
  login: login
}






