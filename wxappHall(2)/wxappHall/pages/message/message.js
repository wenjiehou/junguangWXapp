// pages/chat/chat.js
var headswiperData = require("../../jsCommon/swiperData.js");
var controller = require("./messageController.js");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoPlay:false,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 800,
    indicator_color: "gray",
    indicator_active_color: "white",
    circular: true,
    imgUrls: headswiperData.listData,
    messages: controller.messages,
    listDataState:[],

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var temp = this;

    var num = 5;
    // wx.setTabBarBadge({
    //   index: 3,
    //   text: num.toString(),
    //   success:function(){

    //   },
    //   fail:function(){
        
    //   }
    // })

    this.setData({
      autoPlay:true
    });

    controller.reqMessages({
      complete:function(data){
        temp.setData({
          messages: data,
          listDataState:[]

        });
        
      }
    });


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoPlay: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  reqCode: function () {
    wx.checkSession({
      success: function () {
        console.log("未过期，并且在本生命周期一直有效");

        wx.login({
          success: function (data) {
            console.log("ddddddasdasasd::", data.code);
            wx.request({
              url: 'https://ju.giantfun.cn/v1/login', //仅为示例，并非真实的接口地址
              data: {
                code: data.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data);
                if (res.data.code == 0){
                  wx.setStorageSync("wxkey", res.data.data);
                }
              }
            })
          }

        })
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: function (data) {
            console.log("dddsssssssssssss", data);

            //wx.setStorageSync("openid", data.wxkey);
          }

        }) //重新登录
      }
    })
  },

  reqSign :function(){
    console.log(app.globalData);
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
      method:"GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("sign............",res.data);
      }
    })


  },

  onStatusChange:function(data){
    controller.reqStatusChange({
      msgid:data.detail.msgid
    });
  },

  onRemove: function (data){
    controller.reqRemove({
      msgid: data.detail.msgid
    });
  }
  
})