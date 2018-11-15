// pages/home/home.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("home onLoad options::", options);
    if (options && options.toPage) {
      wx.switchTab({
        url: "../../"+options.toPage
      })
      return
      }
    console.log("app.globalData.logined::", app.globalData.logined);
    app.userInfoReadyCallback = res => {//这里就是登录成功了！！
      wx.switchTab({
        url: '../profit/profit'
      })
      
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }

    setTimeout(function () {
      if (app.globalData.logined == false) {
        this.setData({
          hasUserInfo: false,
        })
      } else if (options && options.toPage){
        wx.switchTab({
          url: "../../" + options.toPage
        })
      }
    }.bind(this), 1000);



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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  }
})