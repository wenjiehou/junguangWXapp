var isDebug = true;
var version = "/v1/"
var serverName = "http://localhost:5564";

var preLogin = this.serverName + this.version + "preLogin";
var login = this.serverName + this.version +"login";
var updateSession = this.serverName + this.version + "updateSession";

module.exports = {
  isDebug:isDebug,
  preLogin: preLogin,
  login: login,
  severName:serverName
}
