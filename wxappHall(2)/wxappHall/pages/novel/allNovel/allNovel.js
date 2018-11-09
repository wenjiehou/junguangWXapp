// pages/novel/allNovel/allNovel.js
var controller = require("./allNovelController.js");
var novelController = require("../novelController.js");
var userinfo = require("../../../jsCommon/userinfo.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
      id: 1,
      url: 'http://ju.cdn.giantfun.cn/yueEarn/banner/xiaoshuobanner8.png'
    },
    {
      id: 2,
      url: 'http://ju.cdn.giantfun.cn/yueEarn/banner/xiaoshuobanner8.png'
    },
    ],

    classifyList:[],
    subList:[],
    book_list:[],
    mUserinfo: {},
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
    controller.reqClassifyList({complete:function(){
      temp.setData({
        classifyList: controller.classifyList
      })

    }});

    controller.reqSubList({
      complete: function () {
        temp.setData({
          subList: controller.subList
        })

      }
    });

    novelController.reqRecommend({
      complete: function () {
        temp.setData({
          book_list: novelController.recommendList

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
  
  },

  gotoShelf:function(){
    wx.redirectTo({
      url: '../shelf/shelf',
    })
  }
})