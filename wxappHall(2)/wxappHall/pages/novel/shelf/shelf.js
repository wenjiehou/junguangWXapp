// pages/novel/shelf/shelf.js
var controller = require("./shelfController.js");
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
    tabIdx:0,
    book_list: [],
    mUserinfo:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var temp = this;


    this.reqBookList();
    userinfo.reqUserinfo({
      complete:function(res){
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

  onTabTitle:function(e){
    console.log(e.currentTarget.dataset.idx);
    this.data.tabIdx = parseInt(e.currentTarget.dataset.idx);

    this.reqBookList()
  },

  reqBookList:function(){
    var temp = this;
    switch (this.data.tabIdx){
      case 0:
        controller.getMarkList(
          {
            complete: function () {
              temp.setData({
                tabIdx:temp.data.tabIdx,
                book_list:controller.markList
              });
            }
          }
        );
      break;
      case 1:
        controller.getSkimList(
          {
            complete: function () {
              temp.setData({
                tabIdx: temp.data.tabIdx,
                book_list: controller.skimList
              });
            }
          }
        );
      break;
    }

  },

  onBookTap: function (e) {
    console.log("onBookTap", e);
    //e.currentTarget.dataset.bookid

    wx.navigateTo({
      url: '../chapter/chapter?bookid=' + e.currentTarget.dataset.bookid,
    })
  },

  gotoAllNovel:function(){
    wx.redirectTo({
      url: '../allNovel/allNovel',
    })
  }
})