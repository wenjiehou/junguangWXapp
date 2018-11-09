package server

import (
	"fmt"
	"jugGoServer/net/httpServer"
	"strconv"
	"time"
)

func Start() {
	err := initConfig()
	if err != nil {
		panic(err)
	}

	err = initDb() //连接数据库
	if err != nil {
		fmt.Println("baocuole!")
		panic(err)
	}

	Redis_InitRedisDb(runTimeConfig.Redis.Ip+":"+strconv.Itoa(runTimeConfig.Redis.Port), runTimeConfig.Redis.Pwd, runTimeConfig.Redis.MaxIdle, runTimeConfig.Redis.MaxActive, runTimeConfig.Redis.TimeOut)
	time.Sleep(1 * time.Second)
	Redis_ClearRedis()

	//初始化定时任务 todo
	InitCrontab()

	go httpServer.StartHttp(runTimeConfig.GMHttp.Ip, runTimeConfig.GMHttp.Port)
}
