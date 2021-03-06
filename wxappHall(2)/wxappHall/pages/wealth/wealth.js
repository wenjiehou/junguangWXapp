// pages/self/self.js
const app = getApp();
var comTask = require("../../jsCommon/comTask.js");
var userinfo = require("../../jsCommon/userinfo.js");
var homeController = require("../home/homeController.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    newbieTasks: comTask.newbieTasks,
    dailyTasks: comTask.dailyTasks, 
    mUserinfo: userinfo.userinfo,
    verify: homeController.verify,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      autoPlay: true
    });

    var temp = this;

    comTask.reqTask({ complete:function(res){
      console.log("newbieTasks", res);
      temp.setData({
        newbieTasks: res.newbieTasks,
        dailyTasks: res.dailyTasks, 
      });

    }});

    userinfo.reqUserinfo({complete:function(res){
      temp.setData({
        mUserinfo: res.userinfo
      });

    }});

    homeController.getVerify({
      complete: function () {
        temp.setData({
          verify: homeController.verify
        });
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      autoPlay: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.rawData = e.detail.rawData
    app.globalData.signature = e.detail.signature
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  gotoGame:function(){
    wx.switchTab({
      url: '../game/game',
    })

  },

  gotoNovel:function(){
    if(this.data.verify == true){
      return;
    }
    wx.navigateTo({
      url: '../novel/novel',
    })
  }

})