var controller = require("./bookController.js");
var loadFont = require("../../../jsCommon/loadFont.js");
var isLoadingDetail = false;

// pages/novel/book/book.js
var readChapter = "";
var allChapters = []; 


Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:"",
    chapterid: 0,
    books: [],
    showControl: false,
    chapter: [],
    chapterOpen: false,
    controlTop: '35%',
    scrollTop: 0,
    canScroll:true,
    showModal: false,
    showMarkBook:false,
    readMode:0,//0白天 1晚上
    daybgColor:"#e8d3a0",
    nightbgColor:"#3c3c3c",
    daytfColor:"black",
    nighttfColor:"#d4d4d4",
    seleIdx:0,//0 没有 1字体 2亮度 3留言
    readbgColors: controller.readbgColors,
    bright:50,
    fontSize:38,
    fontFamily: loadFont.fontFamilys[6],
    openSeleFamily:false,//是否展开选择字体
    fontFamilys: loadFont.fontFamilys,
    targetid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("chapterid", options);
    this.data.chapterid = options.chapterid;
    this.setData({ chapterid: this.data.chapterid});
    this.requestBookDetails(0);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var temp = this;

    var showBookOne = wx.getStorageSync('showBookOne');
    var showModal = false;
    if (!showBookOne==1){
      showModal = true;
      // this.setData({
      //   showModal: true
      // })
    }

    var daybgColor = wx.getStorageSync("daybgColor");
    if (!daybgColor){
      daybgColor = controller.readbgColors[1];
      wx.setStorageSync("daybgColor", daybgColor)
    }

    var nightbgColor = wx.getStorageSync("nightbgColor");
    if (!nightbgColor) {
      nightbgColor = controller.readbgColors[4];
      wx.setStorageSync("nightbgColor", nightbgColor)
    }

    var readMode = wx.getStorageSync("readMode");
    if (!readMode){
      readMode = 0;
    }

    var fontSize = wx.getStorageSync("fontSize");
    if (!fontSize){
      fontSize = 38;
    }

    var fontFamily = loadFont.fontFamilys[6];
    var idx = wx.getStorageSync("fontFamily");
    if (idx){
      fontFamily = loadFont.fontFamilys[idx];
      loadFont.loadfont(fontFamily.value);
    }
    this.setData({
      daybgColor: daybgColor,
      nightbgColor: nightbgColor,
      showModal: showModal,
      readMode: readMode,
      fontSize: fontSize,
      fontFamily:fontFamily,
    });
    console.log("fontFamily", fontFamily, idx);
    


    wx.getScreenBrightness({
      success: function (res){
        console.log("value",res.value);
        temp.setData({
          bright: res.value*100
        });
      }
    })
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
  // onPullDownRefresh: function () {
  //   console.log("刷新刷新刷新。。。。");
  // },

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
  closeModal: function () {
    this.setData({
      showModal: false
    })
    wx.setStorageSync('showBookOne', '1');
  },
  requestBookDetails: function (isNext,toTarget) {
    if (isLoadingDetail){
      return;
    }

    console.log("ddddd2222333", wx.getStorageSync("wxkey"));

    var temp = this;
    isLoadingDetail = true;

    controller.reqChapterDeatil({
      chapterid: this.data.chapterid, complete: function (data) {
        if (isNext) {
          temp.data.books.push(data);
          // if (toTarget){
          //   temp.data.targetid = data.chapter_id;
          // }
          
        } else {
          temp.data.books.unshift(data);
          if (temp.data.books.length > 1){
            console.log(temp.data.books[1].chapter_id);
            temp.data.targetid = temp.data.books[1].chapter_id;
            
          }else{
          
          }
          
          
        }

        if (toTarget) {
          temp.setData({
            books: temp.data.books,
            bookid: data.book_id,
            scrollTop: 0,
          });
        }else{
          temp.setData({
            books: temp.data.books,
            bookid: data.book_id,
            targetid: temp.data.targetid
          });
        }

       

        wx.setNavigationBarTitle({
          title: data.book_name//页面标题为路由参数
        })
        isLoadingDetail = false;
        
       
      }
    });
  },

  onTap: function (e) {

    this.data.showControl = !this.data.showControl;
    if (this.data.showControl) {
      this.readChapter = e.currentTarget.dataset.chapterid;
      this.setData({ chapterid: this.readChapter });
      console.log("this.readChapter", this.readChapter,this.data.scrollTop);
      
    }

    this.setData({
      showControl: this.data.showControl,
      seleIdx:0,
      openSeleFamily:false
    });

  },

  onNext: function () {
    this.data.chapterid = this.data.books[this.data.books.length - 1].next_page;
    this.requestBookDetails(true);
  },

  onPre: function (e) {
    console.log("onPre",e);
    // return;
    if (this.data.books.length == 0) {
      return;
    }
    this.data.chapterid = this.data.books[0].prev_page;
    console.log("this.data.chapterid", this.data.chapterid);
    if (this.data.chapterid == "0") {
      return;
    }
    this.requestBookDetails(false);
  },

  //点击弹出章节提示
  onTapControl: function (e) {
    if (allChapters.length == 0) {
      var temp = this;
      controller.reqBookChaper({
        chapterid: this.readChapter,
        complete: function (data) {
          temp.allChapters = data.data;
          temp.setData({
            chapter: data.data.slice(0, 22),
            chapterOpen: true,
            controlTop: '0%',
            canScroll:false,
            seleIdx:0,
            openSeleFamily:false
          });
        }
      });
    }


  },

  onMove: function () {

  },

  onchapterClose: function () {
    this.setData({
      chapterOpen: false,
      controlTop: '35%',
      canScroll:true
    });

    console.log("onchapterClose");
  },

  onContentScroll: function () {
    this.data.showControl = false;
    this.setData({
      showControl: this.data.showControl,
      seleIdx:0,
      openSeleFamily:false
    });
  },

  onViewPage: function (e) {
    this.data.chapterid = e.currentTarget.dataset.chapterid;
    this.data.books = [];

    this.requestBookDetails(false,true);
    this.setData({
      chapterOpen: false,
      controlTop: '35%',
      showControl: false,
      scrollTop: 0,
      canScroll:true
    });

    console.log("onViewPage");

  },
  onCatchChapter:function(){

  },

  onTapMark:function(){
    this.setData({
      showMarkBook:true,
      showControl:false
    });
  },

  onCancelMark:function(){
    this.setData({
      showMarkBook: false
    });
  },

  onConfirmMark:function(){
    this.setData({
      showMarkBook: false
    });

    controller.reqMarkbook({
      bookid: this.data.bookid
    });
  },
  onTapReadMode:function(){
    this.data.readMode = !this.data.readMode;
    wx.setStorageSync("readMode", this.data.readMode);
    this.setData({
      readMode:this.data.readMode,
    });
    
  },

  onTapBottom:function(e){
    var tIdx = e.currentTarget.dataset.idx;
    if (this.data.seleIdx == tIdx) {
      this.data.seleIdx = 0;
    } else {
      this.data.seleIdx = tIdx;
    }

    if(tIdx == 3){
      this.setData({
        showMarkBook: true,
        // showControl: false 
      });
    }



    this.setData({
      seleIdx: this.data.seleIdx,
      openSeleFamily: false
    });
    
  },

  onTapBgColor:function(e){
    var color = e.currentTarget.dataset.color;

    if(this.data.readMode == 0){//白天
      wx.setStorageSync("daybgColor", color);
      this.setData({
        daybgColor: color
      });
    }else{//晚上
      wx.setStorageSync("nightbgColor", color);
      this.setData({
        nightbgColor: color
      });
    }

    

  },

  onBrightChange:function(e){
    this.setData({
      bright:e.detail.value
    });

    wx.setScreenBrightness({
      value: e.detail.value/100,
    })
  },

  onTapFontSize:function(e){
    var value = parseInt(e.currentTarget.dataset.value) ;
    this.data.fontSize += value;

    if (this.data.fontSize < 10){
      this.data.fontSize = 10;
    } else if (this.data.fontSize > 50){
      this.data.fontSize = 50;
    }

    wx.setStorageSync("fontSize", this.data.fontSize);

    this.setData({
      fontSize:this.data.fontSize,
    });
  },

  onTapShowFamily:function(e){
    this.data.openSeleFamily = !this.data.openSeleFamily;

    this.setData({
      openSeleFamily: this.data.openSeleFamily
    });
  },

  onTapSeleFamily:function(e){
    var idx = e.currentTarget.dataset.family;

    wx.setStorageSync("fontFamily", idx)
    this.setData({
      fontFamily: loadFont.fontFamilys[idx]
    });

    loadFont.loadfont(loadFont.fontFamilys[idx].value);
    

  }

})