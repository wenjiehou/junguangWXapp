var fontFamilys = [{ name: "微软雅黑", value: "yahei" }, { name: "方正综艺新简体", value:"fangzongyi"}, 
  { name: "新宋体", value: "xinsong" }, { name: "楷体", value: "kaiti" }, { name: "黑体", value: "heiti" }, { name: "仿宋", value:"fangsong"},{name:"默认",value:""}];


var loadfont = function (font){
  if(font == ""){
    return;
  }
  wx.showLoading({
    title: '字体加载中...',
  })
  wx.loadFontFace({
    family: font,
    source: 'url("https://jcdn.giantfun.cn/yueEarn/font/' + font + '.woff")',
    success: function (res) {
      console.log("字体加载成功", res, font) //  loaded
    },
    fail: function (res) {
      console.log("字体加载失败", res, font) //  error
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });

 
}

module.exports = {
  fontFamilys: fontFamilys,
  loadfont: loadfont
}

