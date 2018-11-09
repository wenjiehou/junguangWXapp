package httpServer

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"jugGoServer/model"
	"jugGoServer/server/controller"
	"jugGoServer/until"
	"net/http"
	"strconv"
	"strings"
)

const (
	appID     = "wx055683dff71b8c6f"
	AppSecret = "2211a3f3bf2e827f163739a182d9d4c1"
	wxkeyLock = "wenjiehou7589AA"
)

func StartHttp(ip string, port int) {

	http.HandleFunc("/v1/login", login)       //登录请求
	http.HandleFunc("/v1/preLogin", preLogin) //session_key过期了或者没有登录过，请求刷新

	err := http.ListenAndServe(ip+":"+strconv.Itoa(port), nil)
	if err != nil {
		panic(err)

	}
}

func preLogin(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //解析参数，默认是不会解析的
	fmt.Println("form::", r.Form)

	var code string

	for k, v := range r.Form {
		switch k {
		case "code":
			code = strings.Join(v, "")
			//todo
		}
	}
	requestUrl := "https://api.weixin.qq.com/sns/jscode2session?appid=" + appID + "&secret=" + AppSecret + "&js_code=" + code + "&grant_type=authorization_code"
	response, err := http.Get(requestUrl)
	defer response.Body.Close()
	if err != nil {
		fmt.Fprintf(w, "preLogin get openid and session_key failed!")
		return
	}

	data, _ := ioutil.ReadAll(response.Body)
	//fmt.Println(string(data))

	var oSession = &OpenidSession{}

	err = json.Unmarshal(data, oSession)
	if err != nil {
		fmt.Fprintf(w, "preLogin Unmarshal openid and session_key failed!")
		return
	}

	if oSession.Errcode == 0 { //正确的
		//将玩家信息存入数据库，并且缓存到redis中
		wxkey := until.GetMd5String(oSession.Session_key + oSession.Openid + wxkeyLock)
		user, _ := model.GetUserModel().GetUserByOpenId(oSession.Openid)

		if user == nil {
			user = &model.User{
				Openid:     oSession.Openid,
				SessionKey: oSession.Session_key,
				Unionid:    oSession.Unionid,
				Wxkey:      wxkey,
			}
		} else {
			user.SessionKey = oSession.Session_key
			user.Unionid = oSession.Unionid
			user.Wxkey = wxkey
		}

		dbsave := model.GetUserModel().Save(user)
		catchResult := controller.Redis_CatchUserInfo(user)

		if dbsave == nil && catchResult == true {
			v, err := json.Marshal(&ReqResult{
				Data: user.Wxkey,
				Code: 0,
			})
			if err != nil {
				fmt.Fprintf(w, "preLogin Unmarshal openid and session_key failed!")
			} else {
				fmt.Fprintf(w, string(v))
			}

		}

	}

	//fmt.Println("oSession::", oSession)
}

func login(w http.ResponseWriter, r *http.Request) {
	//	fmt.Fprintf(w, "login")
	body, _ := ioutil.ReadAll(r.Body)
	body_str := string(body)
	fmt.Println(body_str)

}
