package httpServer

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"jugGoServer/model"
	"jugGoServer/myconst"
	"jugGoServer/server/controller"
	"jugGoServer/until"
	"net/http"
	"strconv"
	"strings"
)

func StartHttp(ip string, port int) {

	http.HandleFunc("/v1/preLogin", preLogin) //session_key过期了或者没有登录过，请求刷新
	http.HandleFunc("/v1/login", login)       //登录请求
	http.HandleFunc("/v1/getCredit", getCredit)
	http.HandleFunc("/v1/getSignData", getSignData) //获取签到相关信息
	http.HandleFunc("/v1/reqSign", reqSign)         //签到请求
	http.HandleFunc("/v1/signRecom", signRecom)     //明日签到提醒请求

	err := http.ListenAndServe(ip+":"+strconv.Itoa(port), nil)
	if err != nil {
		panic(err)

	}
}

func preLogin(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //解析参数，默认是不会解析的
	//	fmt.Println("form::", r.Form)

	var code string

	for k, v := range r.Form {
		switch k {
		case "code":
			code = strings.Join(v, "")
			//todo
		}
	}
	requestUrl := "https://api.weixin.qq.com/sns/jscode2session?appid=" + myconst.AppID + "&secret=" + myconst.AppSecret + "&js_code=" + code + "&grant_type=authorization_code"
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
		wxkey := until.GetMd5String(oSession.Session_key + oSession.Openid + myconst.WxkeyLock)
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

		fmt.Println("jinlaile!!", dbsave, catchResult, oSession)

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

		} else {
			if dbsave != nil {
				v, _ := json.Marshal(&ReqResult{
					Data: dbsave.Error(),
					Code: 1,
				})
				fmt.Fprintf(w, string(v))
			} else {
				v, _ := json.Marshal(&ReqResult{
					Data: catchResult,
					Code: 1,
				})
				fmt.Fprintf(w, string(v))
			}

		}

	} else {
		v, _ := json.Marshal(&ReqResult{
			Data: oSession.ErrMsg,
			Code: 0,
		})
		fmt.Fprintf(w, string(v))
	}

	//fmt.Println("oSession::", oSession)
}

func login(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var loginInfo = &LoginModel{}
	err := json.Unmarshal(body, loginInfo)
	if err == nil {
		//更新玩家的登录信息，第一步验证合法
		var user *model.User

		user, _ = model.GetUserModel().GetUserByWxkey(loginInfo.Wxkey) //这个wxkey也能找到的

		if user != nil {
			singnature := until.GetSha1String(loginInfo.RawData + user.SessionKey)
			if loginInfo.Signature == singnature {

				if user.Authorize == false {
					user.Authorize = true
					user.Credit += 100 //后面改成可配置的 todo
				}

				user.AvatarUrl = loginInfo.UserInfo.AvatarUrl
				user.City = loginInfo.UserInfo.City
				user.Country = loginInfo.UserInfo.Country
				user.Gender = loginInfo.UserInfo.Gender
				user.NickName = loginInfo.UserInfo.NickName
				user.Province = loginInfo.UserInfo.Province

				model.GetUserModel().Save(user)
				controller.Redis_CatchUserInfo(user)

				v, _ := json.Marshal(&ReqResult{
					Data: user.ID,
					Code: 0,
				})
				fmt.Fprintf(w, string(v))
			} else {
				v, _ := json.Marshal(&ReqResult{
					Data: "check Signature failed",
					Code: 1,
				})
				fmt.Fprintf(w, string(v))
			}
		} else {
			v, _ := json.Marshal(&ReqResult{
				Data: "db not find user",
				Code: 1,
			})
			fmt.Fprintf(w, string(v))
		}

	} else {
		v, _ := json.Marshal(&ReqResult{
			Data: "json unmarshal failed",
			Code: 1,
		})
		fmt.Fprintf(w, string(v))
	}

}

//获取玩家财富值
func getCredit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //解析参数，默认是不会解析的
	var wxkey string
	for k, v := range r.Form {
		switch k {
		case "wxkey":
			wxkey = strings.Join(v, "")
			//todo
		}
	}
	user := getUserByWxkey(wxkey)

	if user != nil {
		v, _ := json.Marshal(&ReqResult{
			Data: &struct {
				Credit uint `json:"credit"`
			}{Credit: user.Credit},
			Code: 0,
		})
		fmt.Fprintf(w, string(v))
	}

}
