package server

import (
	"fmt"
	"jugGoServer/net/httpServer"
	"jugGoServer/server/controller"
	"strconv"
	"time"
)

func Start() {
	err := controller.InitConfig()
	if err != nil {
		panic(err)
	}

	err = controller.InitDb() //连接数据库
	if err != nil {
		fmt.Println("baocuole!")
		panic(err)
	}

	controller.Redis_InitRedisDb(controller.RunTimeConfig.Redis.Ip+":"+strconv.Itoa(controller.RunTimeConfig.Redis.Port), controller.RunTimeConfig.Redis.Pwd, controller.RunTimeConfig.Redis.MaxIdle, controller.RunTimeConfig.Redis.MaxActive, controller.RunTimeConfig.Redis.TimeOut)
	time.Sleep(1 * time.Second)
	controller.Redis_ClearRedis()

	//初始化定时任务 todo
	controller.InitCrontab()

	go httpServer.StartHttp(controller.RunTimeConfig.GMHttp.Ip, controller.RunTimeConfig.GMHttp.Port)
}
