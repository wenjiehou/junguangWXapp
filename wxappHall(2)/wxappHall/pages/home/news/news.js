// pages/home/news/news.js
var controller = require("../homeController.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
      id: 1,
      url: 'http://ju.cdn.giantfun.cn/yueEarn/banner/banner9.png'
    },
    {
      id: 2,
      url: 'http://ju.cdn.giantfun.cn/yueEarn/banner/banner9.png'
    },
    ],
    newsList: controller.newsList,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 800,
    indicator_color: "gray",
    indicator_active_color: "white",
    circular: true,
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
    var temp = this;
    controller.getNews({
      complete: function () {
        temp.setData({
          newsList: controller.newsList,
        });
      }
    });
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