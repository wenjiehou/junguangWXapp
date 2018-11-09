var z = {};
z.EventDispatcher = function() {
  this.__z_e_listeners = {};//定义实例的玩意
};
/**定义一些静态的玩意 */
z.EventDispatcher.prototype.ON_GOT_WEBSOCKET_MSG = "ON_GOT_WEBSOCKET_MSG";//静态像这样

z.EventDispatcher.prototype.addListener = function(type, fun, context) {//定义方法
  var list = this.__z_e_listeners[type];
  if (list === undefined) {
    list = [];
    this.__z_e_listeners[type] = list;
  }
  var lis = {
    func: fun,
    context: context
  };
  list.push(lis);
  return lis;
};
z.EventDispatcher.prototype.removeListener = function(type, fun, context) {
  var list = this.__z_e_listeners[type];
  if (list !== undefined) {
    var size = list.length;
    for (var i = 0; i < size; i++) {
      var obj = list[i];
      console.log("obj", obj);
      if (obj.func === fun && obj.context === context) {
        list.splice(i, 1);
        return;
      }
    }
  }
};
z.EventDispatcher.prototype.dispatchEvent = function(type, event) {
  var list = this.__z_e_listeners[type];
  if (list !== undefined) {
    var size = list.length;
    for (var i = 0; i < size; i++) {
      var ef = list[i];
      var fun = ef.func;
      var context = ef.context;
      if (context != null) {
        fun.call(context, event);
      }else{
        fun(event);
      }
    }
  }
};

var eventCenter = new z.EventDispatcher();


module.exports = {
  eventCenter: eventCenter,
}