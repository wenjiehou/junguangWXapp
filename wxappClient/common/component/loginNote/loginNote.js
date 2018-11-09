// common/component/loginNote/loginNote.js
var app = getApp();
var login = require("../../js/login.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  
 
  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.setData({
        showModal: false,
      })
    },

    getUserInfo:function(e){
      var temp = this;
      console.log("wanjiaxinxi", e);
      if (e.detail.errMsg == "getUserInfo:ok") {//玩家授权了
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.rawData = e.detail.rawData
        app.globalData.signature = e.detail.signature
        app.globalData.encryptedData = e.detail.encryptedData
        app.globalData.iv = e.detail.iv

        login.login({
          complete: function (userData) {
            console.log("login sucess!!");
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(e.detail)
            }
          }
        });
      }

  

      //todo


    }

  }
})
