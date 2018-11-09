
var classifyList = [];

var reqClassifyList = function(callObj){
  var temp = this;

  temp.classifyList = [
    { id: 1001, title: "男生", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/man_button.png" },
    { id: 1002, title: "女生", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/woman_button.png" },
    { id: 1003, title: "排行", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/cup_button.png" },
    { id: 1004, title: "分类", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/fenlei_button.png" }
  ];

  callObj.complete();
  
}

var subList = [];

var reqSubList = function(callObj){
  var temp = this;
  temp.subList = [
    { id: 10011, title: "玄幻小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/xuanhuan_button.png" },
    { id: 10012, title: "奇幻小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/qihuan_button.png" },
    { id: 10013, title: "武侠小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/wuxia_button.png" },
    { id: 10014, title: "仙侠小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/xianxia_button.png" },
    { id: 10015, title: "都市小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/dushi_button.png" },
    { id: 10016, title: "穿越小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/chuanyue_button.png" },
    { id: 10017, title: "异界小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/yijie_button.png" },
    { id: 10018, title: "校园小说", url: "http://ju.cdn.giantfun.cn/yueEarn/story/img/subtype/xiaoyuan_button.png" }
  ];

  callObj.complete();

}

module.exports = {
  classifyList: classifyList,
  subList: subList,
  reqClassifyList: reqClassifyList,
  reqSubList: reqSubList

}