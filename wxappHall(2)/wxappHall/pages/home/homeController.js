
var verify = false;//当前是审核版本

var getVerify = function (callObj){
  wx.showLoading({
    title: '加载中...',
  })

  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/index/prod',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("verify....", res);
      if (res.data.code == 0) {
        if (res.data.prod == 0){//生产状态
           temp.verify = false;
        }else{//审核状态
          temp.verify = true;
        }
        temp.verify = false;
        callObj.complete();
      }
    },
    complete:function(){
      wx.hideLoading();
    }
  })
}

var newsList = [];

var getNews = function (callObj){

  wx.showLoading({
    title: '加载中...',
  })
  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/index/new',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("new....", res);
      if (res.data.code == 0) {
        temp.newsList = res.data.data;
        callObj.complete();
      }
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

module.exports = {
  verify: verify,
  getVerify: getVerify,
  newsList: newsList,
  getNews: getNews
}