// pages/sign.js
var controller = require("signController.js");
var homeController = require("../home/homeController.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    signList: controller.signList,
    popIndex: 0,
    book_list: [],
    shareReward:0,
    signReward:0,
    newReward:0,
    hasShare:false,
    verify: homeController.verify,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("lllllllllllxxxxxxxxxxxxxx.....",options);
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log("lllllllllllxxxxxxxxxxxxxx.....", options);

    this.everyday();
    var temp = this;

    homeController.getVerify({
      complete: function () {
        temp.setData({
          verify: homeController.verify
        });
        temp.doInit();
      }
    })

   
  },

  doInit:function(){

    if (this.data.verify == true){
      return;
    }

    var temp = this;
    wx.request({
      url: 'https://ju.giantfun.cn/v1/book/recommend', //仅为示例，并非真实的接口地址
      data: {
        wxkey: wx.getStorageSync("wxkey"),
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("recommend", res);

        if (res.data.code == 0) {
          temp.setData({
            book_list: res.data.book_list

          });

        }
      }
    })
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
    return { //http://ju.cdn.giantfun.cn/yueEarn/banner/banner2.png
      title: '天哪！免费看小说还能赚钱？！',
      path: 'pages/home/home?id=123',
      imageUrl:"http://ju.cdn.giantfun.cn/yueEarn/share/share.png"
    }
  },

  /**
     * 弹窗
     */
  showDialogBtn: function (e) {
    console.log(e);

    this.setData({
      showModal: true, 
      popIndex: e.currentTarget.dataset.pop_idx
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () { 
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },

  onCloseModal: function () {
    this.hideModal();
  },

  onTapShare:function(){
    var temp = this;
    wx.request({
      url: 'https://ju.giantfun.cn/v1/sign/everyday', //仅为示例，并非真实的接口地址
      data: {
        wxkey: wx.getStorageSync("wxkey"),
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("everyday", res);
        var popIdx = 2;
        if (res.data.award_red_packet > 0){
          popIdx = 3;
        }

        if (res.data.code == 0) {
          temp.setData({
            showModal: true,
            popIndex: popIdx,
            signReward: res.data.sign_red_packet,
            newReward: res.data.award_red_packet,
            hasShare: true
          })
        }
      }
    })


   
  },
  onToNovel: function () {

    this.hideModal();
    console.log("ddsds..");
    wx.navigateTo({
      url: '../novel/novel',
    })
  }
  ,
  onBookTap: function (e) {
    console.log("onBookTap", e);
    //e.currentTarget.dataset.bookid

    wx.navigateTo({
      url: '../novel/chapter/chapter?bookid=' + e.currentTarget.dataset.bookid,
    })

  },

  everyday:function(){
    var temp = this;

    console.log("wx.getStorageSync('wxkey')", wx.getStorageSync("wxkey"));
    wx.request({
      url: 'https://ju.giantfun.cn/v1/sign/everyday/verify', //仅为示例，并非真实的接口地址
      data: {
        wxkey: wx.getStorageSync("wxkey"),
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("dululu", res);

        if (res.data.code == 0) {
          if (res.data.sign == 0){//没签
              temp.setData({
                shareReward: res.data.data,
                hasShare:false
              });
          }
          else//签过了
          {
            temp.setData({
              shareReward: res.data.data,
              hasShare: true
            });
          }
        }
      }
    })
  },

  onGotNewReward:function()
  {
    this.setData({
      popIndex: 4,

    });
  }

})