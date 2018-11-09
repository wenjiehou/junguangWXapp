// pages/novel/chapter/chapter.js
var controller = require("./chapterController.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid: "",
    book: null,
    chapter: null,
    pageArray: [],
    index: 0,
    pageIndex: 1,
    popMode: false,
    rotation: 0,
    isAnimate: false,
    snatchInfo: null,
    popResult: false,
    jinbiEff: controller.getJinbiEff(),
    jinbiEffIdx: -1,
    bookHeat: [],
    resultIdx: -1,
    popOwner:false,
    resultConfirm:null,
    showPopBox:false,
    snatchErrMsg:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("chapter", options);
    this.data.bookid = options.bookid;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var animation = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation
    // this.rotate(480);

  },

  rotate: function(target) {
    this.data.isAnimate = true;
    var temp = this;
    console.log("dudu....");

    var animation = this.animation;
    // 旋转同时放大
    this.animation.rotate(target).step()
    this.setData({
      animationData: this.animation.export()
    })

    setTimeout(function() {
      switch (temp.data.resultIdx) {
        case 0:
        //todo
          controller.getResultConfirm({
            bookid: this.data.bookid,
            complete:function(data){
              temp.setData({
                popMode: false,
                popResult: true,
                resultConfirm:data
              });

            }
          });
      
          
          break;
        case 1:
        case 3:
        case 4:
        case 5:
          temp.playJinbiEff(0);
          break;
        case 2:
          break;
      }
     
      temp.setData({
        rotation: target,
        isAnimate: false
      });
    }.bind(this), 4000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //https://ju.giantfun.cn/v1/book/list
    var temp = this;
    if (this.data.bookid) {
      this.requestBookList(this.data.index);
      controller.getSnatchInfo({
        bookid: this.data.bookid,
        complete: function(data) {
          var bookHeat = [];
          for (var i = 0; i < data.game_heat; i++) {
            bookHeat.push(1);
          }
          if (data.game_heat % 1 != 0) {
            bookHeat.push(0.5);
          }
          temp.setData({
            snatchInfo: data,
            bookHeat: bookHeat
          });
        }
      });
    }




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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.index = e.detail.value

    this.requestBookList(this.data.index);
  },
  toPrePage: function() {
    if (this.data.index > 0) {
      this.data.index--;
      this.requestBookList(this.data.index);
    }

  },
  toNextPage: function() {
    if (this.data.index < this.data.pageArray.length - 1) {
      this.data.index++;
      this.requestBookList(this.data.index);


    }
  },

  requestBookList: function(pageindex) {

    var temp = this;
    console.log(pageindex);

    wx.request({
      url: 'https://ju.giantfun.cn/v1/book/list', //仅为示例，并非真实的接口地址
      data: {
        wxkey: wx.getStorageSync("wxkey"),
        bookid: this.data.bookid,
        pageindex: pageindex,
        order: 2

      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("book/list....", res);
        if (res.data.code == 0) {

          var pageArray = [];
          pageArray.length = Math.ceil(res.data.book.book_chapter_count / 10);

          for (var i = 0; i < pageArray.length; i++) {
            pageArray[i] = "第" + (i * 20 + 1) + "-" + (i + 1) * 20 + "章";
          }
          temp.setData({
            book: res.data.book,
            chapter: res.data.chapter,
            pageArray: pageArray,
            index: temp.data.index,
            pageIndex: parseInt(temp.data.index) + 1
          });

          wx.setNavigationBarTitle({
            title: res.data.book.title //页面标题为路由参数
          })
        }
      }
    })
  },

  onViewPage: function(e) {

    console.log("dsdssssssssssss");

    wx.navigateTo({
      url: '../book/book?chapterid=' + e.currentTarget.dataset.chapterid,
    })
  },

  onStartRead: function() {
    wx.navigateTo({
      url: '../book/book?chapterid=' + this.data.chapter[0].chapter_id,
    })
  },
  ontapCircle: function() {

    if (this.data.isAnimate == false) {
      this.data.isAnimate = true;
      var temp = this;
      controller.getSnatchResult({
        bookid: this.data.bookid,
        complete: function (data) {
          temp.data.resultIdx = data.data.index;
          if (temp.data.resultIdx != -1) {
            var targetRotation = (6 - data.data.index) * 60;
            var curRotation = temp.data.rotation % 360;
            var increaseRotation = 360 * 5 + (targetRotation - curRotation);
            temp.rotate(temp.data.rotation + increaseRotation);
          }else{
            temp.showSnatchErr(data.msg);
          }
        }
      });

    }
    
  },

  onTapSnatchBtn: function() {

    if (this.data.snatchInfo.game_status == 0)//可以抢夺
    {
      this.setData({
        popMode: true,
        popOwner:false
      });

    }else{//不可以抢夺
      this.setData({
        popMode: false,
        popOwner: true
      });
    }
    

  },

  hideModal: function() {
    this.setData({
      popMode: false
    });
  },
  playJinbiEff: function(idx) {
    this.data.jinbiEffIdx = idx;
    this.setData({
      jinbiEffIdx: idx
    });
    if (idx == -1) {
      return;
    }
    idx++;
    if (idx < this.data.jinbiEff.length) {
      setTimeout(this.playJinbiEff.bind(this), 100, idx);
    } else {
      idx = -1;
      setTimeout(this.playJinbiEff.bind(this), 100, idx);
    }


  },

  onTouchmove: function() {

  },
  hidePopOwner:function(){
    this.setData({
      popOwner:false
    });
  },

  ontapResultConfirm:function(){
    this.setData(
      {
        popResult: false
      }

    );

    this.onShow();
  },

  showSnatchErr:function(msg){
    console.log("msg...".msg);
    this.setData({
        showPopBox:true,
        snatchErrMsg:msg
    });
  },

  gotoShelf:function(){
    wx.navigateTo({
      url: '../shelf/shelf',
    })
  }


})