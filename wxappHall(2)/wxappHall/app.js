
var login = require("./jsCommon/login.js");
var loadFont = require("./jsCommon/loadFont.js");
//app.js
App({

//   ftp
// ju.giantfun.cn
// ftpuser
// qazwsx
  onLaunch: function (options) {

    console.log("dddddxxxxxxxxxxxxxx.....", options);
    try {
      var res = wx.getSystemInfoSync()
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
      console.log(res.SDKVersion);
    } catch (e) {

    }


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var temp = this;

    login.noAuthCheck({complete:function(res){
      login.authCheck({
        complete: function (data) {
          if (temp.authReadyCallback){
            temp.authReadyCallback(data)
          }
        }
      });
    }});

    



    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'])
         {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.rawData = res.rawData
              this.globalData.signature = res.signature
              this.globalData.encryptedData = res.encryptedData
              this.globalData.iv = res.iv
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
         }

      }

    })
  },
  globalData: {
    userInfo: null,
    rawData:null,
    signature:null,
    encryptedData:null,
    iv:null,
    sdkVersion: "2.2.0",
    appNewed:false

  }
})