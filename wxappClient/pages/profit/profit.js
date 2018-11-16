// pages/profit/profit.js

var router = require("../../common/js/router.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMode: false,
    seleTimeIdx: 5,
    seleSignTime: [],
    credit: 0, //玩家的福利币
    signData: {
      config: [],
      signed: false,
      conti: 0, //已经连续签到的天数，不包括今天
    },
    daytasks:[],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true,
      success: function () {
        console.log("onLoad 设置分享 withShareTicket 成功");
      }
    })


    this.data.seleSignTime = [];
    var i = 6;
    for (i = 6; i < 23; i++) {
      this.data.seleSignTime.push({
        name: i + ":00",
        value: i
      });
    }

    var signRecomTimeIdx = wx.getStorageSync("signRecomTimeIdx")
    if (!signRecomTimeIdx) {
      signRecomTimeIdx = 5
    }
    this.data.seleTimeIdx = signRecomTimeIdx;

    this.setData({
      seleSignTime: this.data.seleSignTime,
      seleTimeIdx: this.data.seleTimeIdx,
    });


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
    wx.showShareMenu({
      withShareTicket: true,
      success: function () {
        console.log("onshow 设置分享 withShareTicket 成功");
      }
    })

    var temp = this;
    router.getCredit({
      complete: function(data) {
        temp.setData({
          credit: data.credit,
        })

      }
    })
    router.getSignData({
      complete: function(data) {
        var arr = [];

        temp.data.signData.conti = data.conti;
        temp.data.signData.signed = data.signed;
        var signedNum = temp.data.signData.conti;
        var todaySigned = temp.data.signData.signed;

        var isToday = false;
        var signed = false;

        temp.data.signData.config.length = 0; //先删除之前所有的
        for (var key in data.config) {
          if ((todaySigned == false && key == signedNum + 1) || (todaySigned == true && key == signedNum)) {
            isToday = true;
          } else {
            isToday = false;
          }

          if (key <= signedNum) {
            signed = true;
          } else {
            signed = false;
          }
          temp.data.signData.config.push({
            day: key,
            value: data.config[key],
            signed: signed,
            isToday: isToday
          })
        }
        // console.log(temp.data.signData.config);
        temp.setData({
          signData: temp.data.signData,
        });


      }
    })

    //请求每日任务数据
    router.getDaytask({
      complete: function(data) {
        //鸟儿的，需要先排序一下哈，客户端做咯
        data.sort(function(a ,b) {
          if (a.type < b.type){
            return -1
          } else if (a.type == b.type) {
            if (a.value < b.value){
              return -1
            }else{
              return 1
            }
          }else {
            return 1;
          }
        })

        temp.setData({
          daytasks: data,
        });


      }
    })



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
  onShareAppMessage: function (res) {
    return {
      title: '邀请好友得福利币',
      // query: "fromUserId=" + app.globalData.userInfo.userId,//key1=val1&key2=val2 的格式。 wx.getLaunchOptionSync() 或 wx.onShow() 获取启动参数中的 query
      path: 'pages/preload/preload?toPage=pages/profit/profit&fromUserId=' + app.globalData.userInfo.userId
    }
  },

  //下面是开发者自己定义的事件
  reqSign: function() {
    if (this.data.signData.signed) {
      this.setData({
        showMode: true,
      });
      return;
    }

    var temp = this;
    router.reqSign({
      complete: function(data) {
        for (var i = 0; i < temp.data.signData.config.length; i++) {
          if (temp.data.signData.config[i].isToday == true) {
            temp.data.signData.config[i].signed = true;
          }
        }
        temp.data.signData.conti = data.conti;
        temp.data.signData.signed = data.signed;
        temp.data.credit = data.credit;


        temp.setData({
          signData: temp.data.signData,
          credit: temp.data.credit,
          showMode: true,
        });
      }
    })
  },

  //玩家选择提醒时间的
  bindPickerChange: function(e) {

    wx.setStorageSync("signRecomTimeIdx", e.detail.value)
    this.setData({
      seleTimeIdx: e.detail.value,
    });
  },

  hideMode: function() {
    this.setData({
      showMode: false,
    });
  },

  formSubmit: function(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail,e.detail.value)
    var recomTime = this.data.seleSignTime[e.detail.value.timePicker].value;
    var formId = e.detail.formId;

    console.log("recomTime::", recomTime, "formId::", formId);

    this.hideMode();

    if (formId != undefined && formId != "the formId is a mock one") {
      // console.log("need req");
      router.signRecom({
        formId: formId,
        recomTime: recomTime,
        complete: function(data) {
          //啥也不做
        }
      })
    }

  }


})