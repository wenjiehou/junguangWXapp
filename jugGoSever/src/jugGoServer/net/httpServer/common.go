package httpServer

import (
	"jugGoServer/model"
	"jugGoServer/server/controller"
)

//这个仅仅限于取数据，更新数据不要用这个
func getUserByWxkey(wxkey string) *model.User {
	user := controller.Redis_ReadUserInfo(wxkey)
	if user == nil { //内存中没有，就从数据库读取
		user, _ = model.GetUserModel().GetUserByWxkey(wxkey)
		if user != nil {
			controller.Redis_CatchUserInfo(user) //缓存中注入
		}
	}
	return user
}
