var userinfo = null;

/**请求用户财富信息 
 * complete 成功返回函数
 * 
*/
var reqUserinfo = function (callObj){
  // wx.showLoading({
  //   title: '获取信息中',
  // })
  console.log("wxkey", wx.getStorageSync("wxkey"));
  var temp = this;
  wx.request({
    url: 'https://ju.giantfun.cn/v1/fortune/my', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("reqUserinfo....", res);
      if (res.data.code == 0) {
        temp.userinfo = res.data;
        callObj.complete({ userinfo: res.data});
      }
    }
  })
}


module.exports = {
  userinfo: userinfo,
  reqUserinfo: reqUserinfo
}