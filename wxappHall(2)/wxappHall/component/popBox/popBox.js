// component/popBox/popBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "充值"
    },
    content: {
      type: String,
      value: "您的金币已不足，请充值！"
    },
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确认"
    },
    popModal: {
      type: Boolean,
      value: false
    },

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
    ontapCancel:function()
    {
      this.setData({
        popModal:false
      });
      this.triggerEvent('popBoxEvent', 0, {}) 
    },

    ontapConfirm: function () {
      this.setData({
        popModal: false
      });
      this.triggerEvent('popBoxEvent', 1, {})
    },

  }
})