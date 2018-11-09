var book_recommend = {};
var recommendList = [];

var reqRecommend = function(callObj){
  wx.showLoading({
    title: '加载中...',
  })
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
        temp.book_recommend = res.data.book_recommend;
        temp.recommendList = res.data.book_list;
        callObj.complete();
      }
    },
    complete:function(){
      wx.hideLoading();
    }
  })

}

module.exports = {
  book_recommend: book_recommend,
  recommendList: recommendList,
  reqRecommend: reqRecommend

};