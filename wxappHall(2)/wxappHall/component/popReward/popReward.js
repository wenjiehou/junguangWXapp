// component/popReward/popReward.js 
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:{
      type:Boolean,
      value:false
    },

    popIndex:{
      type: Number,
      value:1
    },

    mUserinfo: {
      type:Object,
      value:{}

    },

  },

  
  /**
   * 组件的初始数据
   */
  data: {
    loginRedpacket:"5.20",//登录注册的红包
    animationData: {},
   

  },

  ready:function(){
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    })

    this.animation = animation
    this.rotateAndScale();

    var temp = this;

    

  },

  /**
   * 组件的方法列表
   */
  methods: {
    rotateAndScale: function () {

      var animation = this.animation;
      // 旋转同时放大
      this.animation.scale(0, 0).step({ duration: 0 }) 
      this.setData({
        animationData: this.animation.export()
      })

      setTimeout(function () {
        
        animation.scale(1, 1).step({ duration: 300 })
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 300)
    },

    getUserInfo: function (e) {

      var temp = this;

      console.log("wanjiaxinxi", e);
      if (e.detail.errMsg == "getUserInfo:ok") {//玩家授权了

        console.log("duludala");
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.rawData = e.detail.rawData
        app.globalData.signature = e.detail.signature
        app.globalData.encryptedData = e.detail.encryptedData
        app.globalData.iv = e.detail.iv
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(e.detail)
        }

        var userinfo = app.globalData.userInfo;
        wx.request({
          url: 'https://ju.giantfun.cn/v1/info', //仅为示例，并非真实的接口地址
          data: {
            wxkey: wx.getStorageSync("wxkey"),
            userInfo: userinfo,
            rawData: app.globalData.rawData,
            signature: app.globalData.signature,
            encryptedData: app.globalData.encryptedData,
            iv: app.globalData.iv
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("sign....", res);
            // this.triggerEvent('itemBtnEvent', detail, {}) 
            if (res.data.code == 0) {
              temp.reqPackage();
            }
          }
        })
      }
      else {
        this.setData({
          showModal: false,
        })
        wx.showTabBar({ animation: true });
      }
    },

    reqPackage: function () {

      var temp = this;

      wx.request({
        url: 'https://ju.giantfun.cn/v1/smallmoney/package', //仅为示例，并非真实的接口地址
        data: {
          wxkey: wx.getStorageSync("wxkey"),
        },
        method: "GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("linghongbaole", res);

          if (res.data.code == 0) {
            temp.setData({
              popIndex: 2,
              loginRedpacket: res.data.data,
            })

            temp.rotateAndScale();
          }
        }
      })
    },


    bindgetphonenumber: function (e) {
      var temp = this;
      if (e.detail.errMsg == "getPhoneNumber:ok") {//玩家同意了
        wx.request({
          url: 'https://ju.giantfun.cn/v1/phone', //仅为示例，并非真实的接口地址
          data: {
            wxkey: wx.getStorageSync("wxkey"),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("phone....", res);
            //res.data { msg: "操作成功", no: "15000572476", code: 0, money: "5000" }
            // this.triggerEvent('itemBtnEvent', detail, {}) 
            if (res.data.code == 0) {
              temp.setData({
                popIndex:3,
                loginRedpacket: res.data.money,
              })

              temp.rotateAndScale();

            }
          }
        })

      }
    },

    hideModal:function(){
      if (this.data.popIndex == 2 || this.data.popIndex == 4 || this.data.popIndex == 5)
      {
        this.setData({
          showModal: false,
        })
        wx.showTabBar({ animation: true });
      } else if (this.data.popIndex == 3){
        this.immediatelyCash();
      }

      
    },

    immediatelyCash:function(){
      this.setData({
        popIndex: 4
      })

      this.rotateAndScale();
    },

    gotoSign:function(){
      this.setData({
        showModal: false,
      })
      wx.showTabBar({ animation: true });
      wx.switchTab({
        url: '../sign/sign',
      })

    }


    

  }
})
