var isDebug = true;
var version = "/v1/"
var serverName = "http://192.168.0.169:5564"; 

var preLogin = serverName + version + "preLogin";
var login = serverName + version +"login";
var getCredit = serverName + version +"getCredit";
var getSignData = serverName + version + "getSignData";
var reqSign = serverName + version + "reqSign";
var signRecom = serverName + version + "signRecom";


module.exports = {
  isDebug:isDebug,
  version: version,
  serverName:serverName,
  preLogin: preLogin,
  login: login,
  getSignData: getSignData,
  getCredit: getCredit,
  reqSign: reqSign,
  signRecom: signRecom,
}
