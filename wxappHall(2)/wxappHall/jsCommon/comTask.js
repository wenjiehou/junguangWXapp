
var newbieTasks = {
  title: "新手任务",
  icon: "../../img/task/xinshourenwu_icon.png",
  list: []
}

var dailyTasks = {
  title: "日常任务",
  icon: "../../img/task/richeng_icon.png",
  list: []

}

var callbackList = [];
var reqTask = function(callObj){
  var temp = this;


  wx.request({
    url: 'https://ju.giantfun.cn/v1/task', //仅为示例，并非真实的接口地址
    data: {
      wxkey: wx.getStorageSync("wxkey"),
    },
    method: "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("task....", res);
      if (res.data.code == 0)
      {
        temp.newbieTasks.list = [];
        temp.dailyTasks.list = [];

        var tasks = res.data.data;

        for (var i = 0; i < tasks.length;i++){
          if (tasks[i].task_type == 1){
            temp.newbieTasks.list.push(tasks[i]);
          }else{
            temp.dailyTasks.list.push(tasks[i]);
          }
        }
      
        callObj.complete({ newbieTasks: temp.newbieTasks, dailyTasks: temp.dailyTasks});
      }

      
    }
  })
}

module.exports = {
  newbieTasks: newbieTasks,
  dailyTasks: dailyTasks,
  callbackList: callbackList,
  reqTask: reqTask
}