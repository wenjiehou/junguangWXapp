// component/infoList/infoList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:Array,
      value:[]
    },
    listDataState:{
      type: Array,
      value: []
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
    onTapItem: function (e) {
      console.log(e);

      var index = e.currentTarget.dataset.index;
      if (this.data.listDataState[index] == undefined) {
        this.data.listDataState[index] = false;
      }
      this.data.listDataState[index] = !this.data.listDataState[index];
      if (this.data.listDataState[index] == true){
        if (this.data.listData[index].status == 0){
          this.data.listData[index].status = 1;
          this.triggerEvent('statusChange', { msgid: this.data.listData[index].msg_id}, {}) 
        }
       
      }
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
        listDataState: this.data.listDataState,
        listData: this.data.listData
      })
    },

    catchtapDeleteBtn:function(e){
      var index = e.currentTarget.dataset.index;
      this.triggerEvent('onRemove', { msgid: this.data.listData[index].msg_id }, {}) 
      this.data.listData.splice(index,1);
      this.data.listDataState.splice(index, 1);

      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
        listDataState: this.data.listDataState,
        listData: this.data.listData
      })

     


    }

  },

 
})
