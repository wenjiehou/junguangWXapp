package ipc

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"jugGoServer/myconst"
	"net/http"
	"time"
)

//这个是中控服务器，以后有需要会改成单独的服务器
type MiddleServer struct {
	AccessToken string //微信接口调用凭证
}

var middleServer = &MiddleServer{}

func GetMiddleServer() *MiddleServer {
	return middleServer
}

func StartMiddleServer() {
	go middleServer.getAccessToken() //这个函数独立维护AccessToken

	//todo，其他的一些服务也会在这里
}

//这里是提供服务的
func (s *MiddleServer) Handle(method, params string) *Response {
	resp := &Response{}

	switch method { //看看这个请求是干嘛的
	case "getAccessToken":
		resp.Body = s.AccessToken
		resp.Code = 0

	}

	return resp

}

func (s *MiddleServer) getAccessToken() {
	requestUrl := "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + myconst.AppID + "&secret=" + myconst.AppSecret
	response, err := http.Get(requestUrl)
	defer response.Body.Close()
	if err != nil {
		fmt.Println("req access_token failed!!", err.Error())
		return
	}

	data, _ := ioutil.ReadAll(response.Body)

	accessData := &struct {
		AccessToken string `json:"access_token"`
		Expires_in  int    `json:"expires_in"`
	}{}

	jerr := json.Unmarshal(data, accessData)

	if jerr != nil {
		fmt.Println("Unmarshal access_token failed!!", jerr.Error())
	}
	s.AccessToken = accessData.AccessToken
	fmt.Println("accessData::", accessData)

	time.Sleep(time.Duration(accessData.Expires_in) * time.Second)
	s.getAccessToken()
}

func (s *MiddleServer) Name() string {
	return "MiddleServer"
}
