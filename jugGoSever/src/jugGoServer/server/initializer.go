package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	logf "jugGoServer/log"
	"jugGoServer/model"
	"log"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

var (
	runTimeConfig    *Config
	serverConfigPath = "../config/server.json"
)

func initConfig() error {
	// 服务器配置
	data, err := ioutil.ReadFile(serverConfigPath)
	if err != nil {
		log.Fatal("Can't read config file "+serverConfigPath+"   %v", err)
		return err
	}
	runTimeConfig = new(Config)
	err = json.Unmarshal(data, runTimeConfig)
	fmt.Println("dd:::" + runTimeConfig.GMHttp.Ip + " " + strconv.Itoa(runTimeConfig.GMHttp.Port))
	if err != nil {
		log.Fatal("Read json file error "+serverConfigPath+"   %v", err)
		return err
	}

	//其他的初始化，这里可以以后加

	// 日志
	logf.InitConfig(runTimeConfig.LogLevel, runTimeConfig.LogPath, runTimeConfig.LogOutput)

	return nil
}

func initDb() error {
	fmt.Println("runTimeConfig.Db.String()", runTimeConfig.Db.String())
	db, err := gorm.Open("mysql", runTimeConfig.Db.String())
	if err != nil {
		return err
	}
	err = db.DB().Ping()
	if err != nil {
		return err
	}

	if err == nil {
		fmt.Println("Connect Database [" + runTimeConfig.Db.Ip + ":" + strconv.Itoa(runTimeConfig.Db.Port) + "] Successed")
	}

	db.DB().SetMaxOpenConns(runTimeConfig.Db.MaxConnect)
	db.DB().SetMaxIdleConns(runTimeConfig.Db.MaxIdle)

	err = db.AutoMigrate(
		model.User{},
	).Error

	if err != nil {
		return err
	}

	db.LogMode(runTimeConfig.Db.Debug)

	model.InitCommonDb(db)

	return nil
}
