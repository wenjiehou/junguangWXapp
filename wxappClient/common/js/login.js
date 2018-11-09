var config = require("./config.js");

var preLogin = function(){
  var wxkey = wx.getStorageSync("wxkey");
  if (!wxkey) {//wxkey不存在
  //这里就不需要checkSession，直接登录就好

  }else{//存在，说明登录过，检查session_key有没有过期

  }
}

var reqWxkey = function(callObj){//没有登录过肯定要login要code
  wx.login({
    success:function(data){
      console.log("wx.login():data:", data.code);
      wx.request({
        url: config.preLogin, //仅为示例，并非真实的接口地址
        data: {
          code: data.code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("reqWxkey", res.data);
          if (res.data.code == 0) {
            wx.setStorageSync("wxkey", res.data.data);
            callObj.complete({ wxkey: res.data.data });
          }
        }
      })
    }
  });
}


//验证
var checkSession = function(){
  wx.checkSession({
    success:function(){
      //session_key 未过期，并且在本生命周期一直有效
    },
    fail:function(){
      // session_key 已经失效，需要重新执行登录流程
      wx.login({
        success:function(data){
          console.log("ddddddasdasasd::", data.code);
          wx.request({
            url: config.updateSession, //仅为示例，并非真实的接口地址
            data: {
              code: data.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log("reqWxkey", res.data);
              if (res.data.code == 0) {
                wx.setStorageSync("wxkey", res.data.data);
                callObj.complete({ wxkey: res.data.data });
              }
            }
          })
        }
      })
    }
  })

}



