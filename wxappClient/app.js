//app.js
var login = require("./common/js/login.js");

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var temp = this;

    login.preLogin({ complete: function(data){
      var wxkey = data.wxkey;
      //获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log(res.userInfo);
                // 可以将 res 发送给后台解码出 unionId
                temp.globalData.userInfo = res.userInfo
                temp.globalData.rawData = res.rawData
                temp.globalData.signature = res.signature
                temp.globalData.encryptedData = res.encryptedData
                temp.globalData.iv = res.iv

                login.login({complete:function(userId){
                  console.log("login sucess!!", userId);
                  temp.globalData.userInfo.userId = userId;
                  temp.globalData.logined = true;
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (temp.userInfoReadyCallback) {
                    temp.userInfoReadyCallback(res)
                  }
                }});



                
                
              }
            })
          }

        }

      })

    }})


   


  },
  globalData: {
    logined :false,
    userInfo: null,
    rawData: null,
    signature: null,
    encryptedData: null,
    iv: null
  }
})