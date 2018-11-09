//收藏的书
var markList = [];

var getMarkList = function(callObj){
  var temp = this;
  wx.showLoading({
    title: '加载中...',
  })

  wx.request({
    url: 'https://ju.giantfun.cn/v1/favorite/list', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),

    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("markList", res);
      wx.hideLoading();

      if (res.data.code == 0) {
        temp.markList = res.data.data;
        callObj.complete();

      }
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

//读过的书
var skimList = [];

var getSkimList = function(callObj){
  var temp = this;
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: 'https://ju.giantfun.cn/v1/book/history', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("skimList", res);
      wx.hideLoading();

      if (res.data.code == 0) {
        temp.skimList = res.data.data;
        callObj.complete();

      }
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

module.exports = {
  markList: markList,
  getMarkList: getMarkList,
  skimList: skimList,
  getSkimList: getSkimList
}