var isDebug = true;
var version = "/v1/"
var serverName = "http://192.168.0.169:5564"; 

var preLogin = serverName + version + "preLogin";

var login = serverName + version +"login";

module.exports = {
  isDebug:isDebug,
  version: version,
  serverName:serverName,
  preLogin: preLogin,
  login: login
}
