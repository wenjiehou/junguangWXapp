var getGift = require("../../jsCommon/getGift.js");
var headswiperData = require("../../jsCommon/swiperData.js");
var pay = require("../../jsCommon/pay.js");
var app = getApp();
var userinfo = require("../../jsCommon/userinfo.js");
var controller = require("./homeController.js");
var login = require("../../jsCommon/login.js");
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: headswiperData.listData,
    activitys: [{
        id: 1,
        url: '../../img/activity/qiandao_button.png'
      },
      {
        id: 2,
        url: '../../img/activity/zutuan_button.png'
      },
      {
        id: 3,
        url: '../../img/activity/mianfei_button.png'
      },
      {
        id: 4,
        url: '../../img/activity/xianjinling_button.png'
      },
    ],

    popIndex:1,
    showModal:false,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 800,
    indicator_color: "gray",
    indicator_active_color: "white",
    circular: true,
    mUserinfo:{},
    verify: controller.verify,
    newsList: controller.newsList,

//ddddd
    loginRedpacket:5.0,
//ddddd


    gameList: [
      [{
          id: 1,
          name: "游戏专区",
          icon: "../../img/gameList/youxi_button.png"
        },
        {
          id: 2,
          name: "视频专区",
          icon: "../../img/gameList/shipin_button.png"
        },
        {
          id: 3,
          name: "小说专区",
          icon: "../../img/gameList/xiaoshuo_button.png"
        }
      ],
      [{
          id: 4,
          name: "游戏专区",
          icon: "../../img/gameList/youxi_button.png"
        },
        {
          id: 5,
          name: "视频专区",
          icon: "../../img/gameList/shipin_button.png"
        },
        {
          id: 6,
          name: "小说专区",
          icon: "../../img/gameList/xiaoshuo_button.png"
        }
      ]
    ],

    giftList: getGift.list,
    book_list:null,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var temp = this;
    getGift.onCallBackList.push(function() {
      temp.setData({
        giftList: getGift.list
      });
    });


 
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var temp = this;
    // userinfo.reqUserinfo({
    //   complete: function (res) {
    //     temp.setData({
    //       mUserinfo: res.userinfo
    //     });

    //   }
    // });

    controller.getNews({complete:function(){
      temp.setData({
        newsList:controller.newsList,
      });
    }});

    controller.getVerify({
      complete: function () {
        temp.setData({
          verify: controller.verify
        });
        temp.doInit();
      }
    })
  },

  doInit:function(){
    // if (this.data.verify) {
    //   return;
    // }
    var temp = this;

    app.authReadyCallback = function(res){
      console.log("home...................",res);
      if (res.auth == false) {
        temp.popReward(1);
      } else {
        temp.popReward(5);
      }
    }

    if (login.checked){
      console.log("login.checked", login.checked);
      if(login.auth){
        temp.popReward(5);
      }else{
        temp.popReward(1);
      }
    }


    // if (app.globalData.userInfo == null) {
    //   wx.getSetting({
    //     success: res => {
    //       console.log("scope.userInfo");
    //       if (!res.authSetting['scope.userInfo']) {
    //         temp.popReward(1);
    //       } else {
    //         if (app.globalData.appNewed == false) {
    //           app.globalData.appNewed = true;
    //           temp.popReward(5);
    //         }
    //       }
    //     }
    //   })
    // } else {
    //   console.log("scope.userInfo1", app.globalData.appNewed);
    //   if (app.globalData.appNewed == false) {
    //     app.globalData.appNewed = true;
    //     temp.popReward(5);
    //   }
    // }
  },

  popReward:function(idx){
    this.setData({
      showModal: true,
      popIndex:idx
    });
    wx.hideTabBar({ animation: true });
  },

  hideReward: function () {
    this.setData({
      showModal: false,
    })
    wx.showTabBar({ animation: true });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    //每次都获取用户资产
    userinfo.reqUserinfo({
      complete: function (res) {
        temp.setData({
          mUserinfo: res.userinfo
        });

      }
    });

    //  this.popReward(5);
    console.log("this.data.showModal",this.data.showModal);
    this.setData({
      autoPlay: true
    });

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
  onShareAppMessage: function(res) {

  },

  onTapAct: function(e) {
    switch (e.currentTarget.dataset.id) {
      case 1:
        wx.navigateTo({
          url: '../sign/sign',
        })
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    }

  },
  onToNovel:function(){

    console.log("ddsds..");
    wx.navigateTo({
      url: '../novel/novel',
    })
  },

  onBookTap: function (e) {
    console.log("onBookTap", e);
    //e.currentTarget.dataset.bookid

    wx.navigateTo({
      url: '../novel/chapter/chapter?bookid=' + e.currentTarget.dataset.bookid,
    })

  },

  onReqPay:function(){
    pay.payFun();
  },

  onToNews:function(){
    wx.navigateTo({
      url: './news/news',
    })
  },

  gotoWealth:function(){
    wx.switchTab({
      url: '../wealth/wealth',
    })
  }
  
})