
var list = [{
  user_id: 1,
  head_img: "../../img/giftList/touxiang.png",
  name: "我是个测试01",
  msg: "成功领取了iponeX",
  occur_time: "10分钟前",
  gift: {
    name: "",
    icon: "../../img/giftList/iphoneX.png",
  }
},
{
  user_id: 2,
  head_img: "../../img/giftList/touxiang.png",
  name: "我是个测试02",
  msg: "成功领取了电话卡",
  occur_time: "36分钟前",
  gift: {
    name: "",
    icon: "../../img/giftList/iphoneX.png",
  }
},
{
  user_id: 3,
  head_img: "../../img/giftList/touxiang.png",
  name: "我是个测试03",
  msg: "成功领取了XXX",
  occur_time: "44分钟前",
  gift: {
    name: "",
    icon: "../../img/giftList/iphoneX.png",
  }
},
];

var onCallBackList = [];
var update_gift_list = function(){ 

var temp = this;

 wx.request({
   url: 'http://ddqp.17lwba.com/',
   complete:function(){
     temp.list = [{
       user_id: 1,
       head_img: "../../img/giftList/touxiang.png",
       name: "ta是个测试01",
       msg: "成功领取了iponeX",
       occur_time: "10分钟前",
       gift: {
         name: "",
         icon: "../../img/giftList/iphoneX.png",
       }
     },
     {
       user_id: 2,
       head_img: "../../img/giftList/touxiang.png",
       name: "你是个测试02",
       msg: "成功领取了电话卡",
       occur_time: "36分钟前",
       gift: {
         name: "",
         icon: "../../img/giftList/iphoneX.png",
       }
     },
     {
       user_id: 3,
       head_img: "../../img/giftList/touxiang.png",
       name: "你是个测试03",
       msg: "成功领取了XXX",
       occur_time: "44分钟前",
       gift: {
         name: "",
         icon: "../../img/giftList/iphoneX.png",
       }
     },
     ];
     console.log("nimamasile...................");
     for (var i in temp.onCallBackList){
       if (temp.onCallBackList[i]){
         temp.onCallBackList[i]();
       }
     }
   }
 })
}


module.exports= {
  list :list,
  update_gift_list: update_gift_list,
  onCallBackList: onCallBackList
}