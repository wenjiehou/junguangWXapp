
var banners = [];

var reqBanners = function(){
  this.banners = [
    {id:1001, imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/gamebanner1.png" },
    {id:1002, imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/gamebanner2.png" }

  ];
}

var games = [];

var reqGames = function(callObj){
  wx.showLoading({
    title: '加载中...',
  })

  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/index/new/game',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("game....", res);
      if (res.data.code == 0) {
        temp.games = res.data.data;
        callObj.complete();
      }
    },
    complete:function(){
      wx.hideLoading();
    }
  })



  // this.games = [
  //   { id: 1001, name: "巨鲨捕鱼", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_1.png", online: 6542 },
  //   { id: 1002, name: "泡泡先锋", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_2.png",online: 1254 },
  //   { id: 1003, name: "弹弹堂", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_3.png", online: 2356 },
  //   { id: 1004, name: "王者荣耀", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_4.png",online: 6895 },
  //   { id: 1005, name: "第五人格", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_5.png",online: 9856 },
  //   { id: 1006, name: "万象物语", imgUrl: "http://ju.cdn.giantfun.cn/yueEarn/game/game_6.png",online: 4568 },
  // ];
}

module.exports = {
  banners: banners,
  reqBanners: reqBanners,
  games: games,
  reqGames: reqGames


}