var jinbiEff = [];


var getJinbiEff = function(){
  if(this.jinbiEff.length == 0){
    for (var i = 0; i < 18; i++) {
      jinbiEff.push("http://ju.cdn.giantfun.cn/yueEarn/story/img/eff/jinbiEff/eff" + i + ".png");
    }
  }

  return this.jinbiEff;
}

var getSnatchInfo = function(callObj){
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: 'https://ju.giantfun.cn/v1/game/view',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      bookid: callObj.bookid
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("getSnatchInfo....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data.data);
      }
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

var getSnatchResult = function (callObj){
  wx.request({
    url: 'https://ju.giantfun.cn/v1/game/result',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      bookid: callObj.bookid
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("getSnatchResult....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data);
      }
    }
  })
}

var getResultConfirm = function (callObj){
  wx.request({
    url: 'https://ju.giantfun.cn/v1/game/result/succeed',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      bookid: callObj.bookid
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("getResultConfirm....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data.data);
      }
    }
  })
}

module.exports = {
  jinbiEff: jinbiEff,
  getJinbiEff: getJinbiEff,
  getSnatchInfo: getSnatchInfo,
  getSnatchResult: getSnatchResult,
  getResultConfirm: getResultConfirm
}