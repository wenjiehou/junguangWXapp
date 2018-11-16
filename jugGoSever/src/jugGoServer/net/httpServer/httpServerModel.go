package httpServer

import (
	"jugGoServer/model"
)

//解析微信的openid和session_key
type OpenidSession struct {
	Openid      string `json:"openid"`
	Session_key string `json:"session_key"`
	Unionid     string `json:"unionid"`
	Errcode     int    `json:"errcode"`
	ErrMsg      string `json:"errMsg"`
}

//返回数据结构定义
type ReqResult struct {
	Data     interface{} `json:"data"`
	Code     int         `json:"code"`
	ErrorMsg string      `json:"errorMsg"`
}

//登录请求
type LoginModel struct {
	Wxkey         string      `json:"wxkey"`
	UserInfo      *model.User `json:"userInfo"`
	RawData       string      `json:"rawData"`
	Signature     string      `json:"signature"`
	EncryptedData string      `json:"encryptedData"`
	Iv            string      `json:"iv"`
	FromUserId    uint        `json:"fromUserId"`
}

type SignModel struct {
	Wxkey string `json:"wxkey"`
}
