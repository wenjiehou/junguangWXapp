// component/comList/comList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:Array,
      value: [
        { id:1001,title: "新手任务", desc: "最高可得5000金币", isHot: true, goto: "" },
        { id: 1002,title: "输入邀请码", desc: "再领取0.5元红包", isHot: false, goto: "" },
        { id: 1002,title: "绑定微信", desc: "首次绑定+300金币", isHot: false, goto: "" },

      ]
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
