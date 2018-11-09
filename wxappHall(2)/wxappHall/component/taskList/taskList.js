// component/taskList/taskList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    title: {
      type: String,
      value: ""
    },
    icon: {
      type: String,
      value: ""
    },
  
    listData: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listDataState: [],
    openNum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onClickItem: function(e) {
      var index = e.currentTarget.dataset.index;
      if (this.data.listDataState[index] == undefined) {
        this.data.listDataState[index] = false;
      }
      this.data.listDataState[index] = !this.data.listDataState[index];
      if (this.data.listDataState[index]) {
        this.data.openNum += 1;
      } else {
        this.data.openNum -= 1;
      }
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
        listDataState: this.data.listDataState,
        openNum: this.data.openNum
      })

    },

    _onTap:function(e){
      var detail = this.data.listData[e.currentTarget.dataset.index];
      this.triggerEvent('itemBtnEvent', detail, {}) 
    }
  }


})