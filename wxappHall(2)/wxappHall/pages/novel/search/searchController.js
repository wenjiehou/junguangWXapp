var reqSearch = function (callObj){
  

  
  wx.request({
    url: 'https://ju.giantfun.cn/v1/search',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      w: callObj.w
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("search....", res);
      if (res.data.code == 0) {
        callObj.complete(res.data);
      }
    }
  })

}

module.exports = {
  reqSearch: reqSearch

}