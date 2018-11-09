package test

import (
	"fmt"
	"jugGoServer/model"
	"jugGoServer/server"
)

func TestGorm() {

	//	user := &model.User{
	//		Openid:     "dsdsfsdfs11f2sdfds",
	//		Unionid:    "fdslkflsf56fdd",
	//		SessionKey: "dsdsfsdfs11f2sdfds",
	//		NickName:   "wenjiedu11",
	//		Sex:        2,
	//		GpsLan:     1235.56,
	//		GpsLat:     3256.63,
	//		City:       "dsdsfsdfs11f2sdfds",
	//		Country:    "dsdsfsdfs11f2sdfds",
	//		Credit:     152333,
	//	}

	user := server.Redis_ReadPlayerInfo("dsdsfsdfs11f2sd45")
	if user == nil {
		user, err := model.GetUserModel().GetUserByOpenId("dsdsfsdfs11f2sd45")
		fmt.Println("user db::", user)
		if err == nil && user != nil {
			fmt.Println("haha")
			result := server.Redis_CatchPlayerInfo(user)
			if result == true {
				fmt.Println("redis catch success!")
			}
		}
	} else {
		fmt.Println("redis:: userinfo::", user)
	}

	//	user, err := model.GetUserModel().GetUserByUnionId("fdslkflsf56fdd")

	//	if err != nil {
	//		model.GetUserModel().Create(user)
	//	} else {
	//		fmt.Println("dululu...")
	//		user.NickName = "xiaodudu"
	//		user.BeRecomend = 1
	//		model.GetUserModel().Save(user)
	//	}

	//	fmt.Println("user.id::", user.ID)

	//	recomed := &model.Recomend{
	//		UserID:       1,
	//		Chanel:       1,
	//		RecomendUser: 2,
	//	}

	//	model.GetRecomendModel().Create(recomed)

	//	user, err = model.GetUserModel().GetUserByUnionId("dsdsfsdfs11f2sdfds")

	//	fmt.Println("user.recomends::", user.ID, user.Recomends)

}
