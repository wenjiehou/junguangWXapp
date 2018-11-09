var readbgColors = ["#eee9dd","#e8d3a0","#a2b3b3","#aaf49c","#3c3c3c","#000000"];
var fontFamilys = ["微软雅黑", "方正综艺新简体", "新宋体", "楷体", "heiti","仿宋"];


var reqBookChaper = function(callObj){
  wx.request({
    url: 'https://ju.giantfun.cn/v1/book/details-list',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      chapterid:callObj.chapterid,
      order:0
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("details-list....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data);
      }
    },
    complete:function(){
    }
  })

}

var  reqChapterDeatil = function(callObj){
  wx.request({
    url: 'https://ju.giantfun.cn/v1/book/details', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      chapterid: callObj.chapterid
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("book/details....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data);
      }
    },
    complete: function () {
    }
  })
}

//请求收藏某本书
var reqMarkbook = function(callObj){
  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/favorite/fav', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      bookid: callObj.bookid
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      // console.log("reqMarkbook... success",res);
      if(res.data.code == 0 && res.data.data == 1){
        wx.showToast({
          title: '收藏成功',
        })
      }
      
    },
    complete: function () {
    }
  })
}


module.exports = {
  readbgColors:readbgColors,
  reqBookChaper: reqBookChaper,
  reqChapterDeatil: reqChapterDeatil,
  reqMarkbook: reqMarkbook,
  fontFamilys: fontFamilys
};