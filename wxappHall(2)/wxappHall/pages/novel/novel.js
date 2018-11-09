// pages/hot/hot.js
var controller = require("./novelController.js");
var userinfo = require("../../jsCommon/userinfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 800,
    indicator_color: "gray",
    indicator_active_color: "white",
    circular: true,

    imgUrls: [{
        id: 1,
        url: 'http://ju.cdn.giantfun.cn/yueEarn/story/img/banner/banner.png'
      },

    ],
    book_recommend: {},
    book_list: [],
    mUserinfo: {},

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var temp = this;
    // wx.request({
    //   url: 'https://ju.giantfun.cn/v1/book/recommend', //仅为示例，并非真实的接口地址
    //   data: {
    //     wxkey: wx.getStorageSync("wxkey"),
    //   },
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log("recommend", res);

    //     if (res.data.code == 0) {
          // temp.setData({
          //   book_recommend: res.data.book_recommend,
          //   book_list: res.data.book_list

          // });

    //     }
    //   }
    // })

    var temp = this;
    controller.reqRecommend({
      complete:function(){
        temp.setData({
          book_recommend: controller.book_recommend,
          book_list: controller.recommendList

        });
      }

    });

    userinfo.reqUserinfo({
      complete: function (res) {
        temp.setData({
          mUserinfo: res.userinfo
        });
      }
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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

  onBookTap: function(e) {
    console.log("onBookTap", e);
    //e.currentTarget.dataset.bookid

    wx.navigateTo({
      url: './chapter/chapter?bookid=' + e.currentTarget.dataset.bookid,
    })


  },

  onTap: function() {
    wx.request({
      url: 'https://ju.giantfun.cn/v1/wxpay/pay', //仅为示例，并非真实的接口地址
      data: {
        wxkey: wx.getStorageSync("wxkey"),
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("pay....", res);
        if (res.data.code == 0) {

        }
      }
    })
  },

  toSearch: function() {
    wx.navigateTo({
      url: './search/search',
    })
  },

  gotoShelf:function(){
    wx.navigateTo({
      url: './shelf/shelf',
    })
  },

  gotoAllNovel:function(){
    wx.navigateTo({
      url: './allNovel/allNovel',
    })
  }
})