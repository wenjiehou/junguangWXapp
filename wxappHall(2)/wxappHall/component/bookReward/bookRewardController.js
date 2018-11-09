var dispatcher = require("../../jsCommon/eventDispather.js");
var eventCenter = dispatcher.eventCenter

wx.onSocketOpen(function (res) {
  console.log('WebSocket连接已打开！')
})
wx.onSocketError(function (res) {
  console.log('WebSocket连接打开失败，请检查！', res)
})

wx.onSocketMessage(function (res) {
  eventCenter.dispatchEvent(eventCenter.ON_GOT_WEBSOCKET_MSG, {
    event: eventCenter.ON_GOT_WEBSOCKET_MSG,
    data:res.data
  });
})

wx.onSocketClose(function (res) {
  console.log('WebSocket 已关闭！')
})

var connectBook = function(){
  var url = 'wss://ju.giantfun.cn/v1/' + wx.getStorageSync("wxkey");
  console.log("url...",url,"ddd");
  wx.connectSocket({
    url: url,
    data: {
      x: '',
      y: ''
    },
    header: {
      'content-type': 'application/json'
    },
    method: "GET"
  })
}

var closeBook = function(){
  wx.closeSocket();
}


var onGotWebsocketMsg = function (event) {
  // console.log("收到信息....", event);
  var data = JSON.parse(event.data);
  var cur = data.total_seconds - data.seconds;
  // console.log("cur...", cur);
  this.drawCircle(cur, data.total_seconds);
  if (data.v > 0) {
    this.playAni(data.v);
   
  }
}

module.exports = {
  connectBook:connectBook,
  closeBook: closeBook,
  onGotWebsocketMsg: onGotWebsocketMsg
  
}