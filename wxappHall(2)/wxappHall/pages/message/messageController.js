var messages = [];
var reqMessages = function(callObj){
  var temp = this;

  wx.request({
    url: 'https://ju.giantfun.cn/v1/message/query', 
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("message....", res);
      if (res.data.code == 0) {
        temp.messages = res.data.data;
        if (callObj && callObj.complete){
          callObj.complete(res.data.data);
        }
      }
    }
  })

}

//请求消息状态变更
var reqStatusChange = function(callObj){
  var temp = this;

  wx.request({
    url: 'https://ju.giantfun.cn/v1/message/read',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      msgid: callObj.msgid
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("message/reqStatusChange...", res);
      if (res.data.code == 0) {
        //暂时不用管，需要的时候再处理
      }
    }
  })
}

//请求删除消息
var reqRemove = function (callObj) {
  var temp = this;

  wx.request({
    url: 'https://ju.giantfun.cn/v1/message',
    data: {
      wxkey: wx.getStorageSync("wxkey"),
      msgid: callObj.msgid
    },
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("message/reqRemove...", res);
      if (res.data.code == 0) {
        //暂时不用管，需要的时候再处理
      }
    }
  })
}

module.exports = {
  messages: messages,
  reqMessages: reqMessages,
  reqStatusChange: reqStatusChange,
  reqRemove: reqRemove
}