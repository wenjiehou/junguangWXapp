package httpServer

type OpenidSession struct {
	Openid      string `json:"openid"`
	Session_key string `json:"session_key"`
	Unionid     string `json:"unionid"`
	Errcode     int    `json:"errcode"`
	ErrMsg      string `json:"errMsg"`
}

type ReqResult struct {
	Data     interface{} `json:"data"`
	Code     int         `json:"code"`
	ErrorMsg string      `json:"errorMsg"`
}
