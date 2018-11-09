// component/getGift/getGift.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoPlay:{
      type:Boolean,
      value:false
    },

    giftList: {
      type: Array,
      value: [{
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
      ],
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
