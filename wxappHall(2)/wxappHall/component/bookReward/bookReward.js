// component/bookReward/bookReward.js
var controller = require("../../pages/novel/chapter/chapterController.js");
var bookController = require("./bookRewardController.js");

var dispatcher = require("../../jsCommon/eventDispather.js");
var eventCenter = dispatcher.eventCenter

var varName;
var width;
var owidth;
var oheight;
var otop;
var step;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalTime: {
      type: String,
      value: 10
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTip: "none",
    jinbiEff: controller.getJinbiEff(),
    jinbiEffIdx: -1,
    scale: 0.2,
    animationData: null,
    showEff: false,
    popMode: true,
    popValue:false,
    value:100

  },

  /**
   * 组件的方法列表
   */
  methods: {
    ontouchStart: function() {
      console.log("...");
      this.setData({
        showTip: "flex",
        totalTime: 100
      });
    },

    ontouchEnd: function() {
      this.setData({
        showTip: "none"
      });
    },

    drawCircle: function(cur, total) {
      
      step = cur;
      var ctx = wx.createCanvasContext('canvasArcCir', this);
      if (cur == 0) {
        ctx.setFillStyle('#e76521');
        ctx.clearRect(0, 0, width, width);
        ctx.draw();
      }



      function drawArc(s, e) {
        var x = width,
          y = width,
          radius = width - 2;
        ctx.setLineWidth(2);
        ctx.setStrokeStyle('#e76521');
        ctx.setLineCap('round');
        ctx.beginPath();
        ctx.arc(x, y, radius, s, e, false);
        ctx.stroke()
        ctx.draw()
      }

      var orignalArc = Math.PI * (130 / 180);

      var n = total;
      var startAngle = orignalArc,
        endAngle = step * 2 * Math.PI * (7 / 9) / n + orignalArc;
      var animation_interval = 1000;
      drawArc(startAngle, endAngle);
      // var animation = function() {
      //   if (step <= n) {
      //     endAngle = step * 2 * Math.PI * (7 / 9) / n + orignalArc;
      //     drawArc(startAngle, endAngle);
      //     // step++;
      //   } else {
      //     //clearInterval(varName);
      //   }
      // };
      // clearInterval(varName);

      // varName = setInterval(animation, animation_interval)
    },

    playAni: function(value) { //播放那个一堆动画  首先经过1s飞到中间 1s变大 保持2秒 1s变小 消失并淡出金币


      this.animation.translate(wx.getSystemInfoSync().screenWidth / 2 - (owidth) + 13, -wx.getSystemInfoSync().screenHeight / 2 + (oheight + 20)).scale(0.2, 0.2).step({
        duration: 30
      });
      this.animation.translate(0, 0).step()
      this.setData({
        animationData: this.animation.export()
      })

      setTimeout(function(){
        this.setData({
          showEff: true,
        })

      }.bind(this),60);

      setTimeout(function() {
        this.animation.scale(1, 1).step()
        this.setData({
          animationData: this.animation.export()
        })

        setTimeout(function() {
          this.animation.scale(0.2, 0.2).step()
          this.setData({
            animationData: this.animation.export()
          })

          setTimeout(function() {
            wx.showToast({
              title: '+' + value,
              image: "../../../img/wealth/yuedubi_icon.png"
            })
            // this.setData({
            //   popValue: true,
            //   value: value
            // })
            this.playJinbiEff(0);
          }.bind(this), 600);

        }.bind(this), 600);

      }.bind(this), 630);

    },

    playJinbiEff: function(idx) {
      this.data.jinbiEffIdx = idx;
      this.setData({
        jinbiEffIdx: idx,
        showEff: false,
      });
      if (idx == -1) {
        this.setData({
          popValue: false,
        })
        return;
      }
      idx++;
      if (idx < this.data.jinbiEff.length) {
        setTimeout(this.playJinbiEff.bind(this), 100, idx);
      } else {
        idx = -1;
        setTimeout(this.playJinbiEff.bind(this), 100, idx);
      }
    },
  },

  ready: function() {

    console.log("组件开启");
    var temp = this;

    eventCenter.addListener(eventCenter.ON_GOT_WEBSOCKET_MSG, bookController.onGotWebsocketMsg, this);

    bookController.connectBook();

    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.animation = animation

    var query = wx.createSelectorQuery().in(this)
    query.select('#canvas-container').boundingClientRect(function(res) {
      width = res.width / 2;
    }).exec()

    query.select('#orignal-pos').boundingClientRect(function(res) {
      console.log("orignal-pos", res);
      owidth = res.width;
      oheight = res.height;
      otop = res.top;
      console.log("owidth", owidth);
    }).exec()
  },

  detached: function() {
    console.log("组件关闭");
    bookController.closeBook();
    eventCenter.removeListener(eventCenter.ON_GOT_WEBSOCKET_MSG, bookController.onGotWebsocketMsg,this);
  },




})