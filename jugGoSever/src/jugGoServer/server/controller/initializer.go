package controller

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
	RunTimeConfig    *Config
	serverConfigPath = "../config/server.json"
)

func InitConfig() error {
	// 服务器配置
	data, err := ioutil.ReadFile(serverConfigPath)
	if err != nil {
		log.Fatal("Can't read config file "+serverConfigPath+"   %v", err)
		return err
	}
	RunTimeConfig = new(Config)
	err = json.Unmarshal(data, RunTimeConfig)
	fmt.Println("dd:::" + RunTimeConfig.GMHttp.Ip + " " + strconv.Itoa(RunTimeConfig.GMHttp.Port))
	if err != nil {
		log.Fatal("Read json file error "+serverConfigPath+"   %v", err)
		return err
	}

	//其他的初始化，这里可以以后加

	// 日志
	logf.InitConfig(RunTimeConfig.LogLevel, RunTimeConfig.LogPath, RunTimeConfig.LogOutput)

	return nil
}

func InitDb() error {
	fmt.Println("runTimeConfig.Db.String()", RunTimeConfig.Db.String())
	db, err := gorm.Open("mysql", RunTimeConfig.Db.String())
	if err != nil {
		return err
	}
	err = db.DB().Ping()
	if err != nil {
		return err
	}

	if err == nil {
		fmt.Println("Connect Database [" + RunTimeConfig.Db.Ip + ":" + strconv.Itoa(RunTimeConfig.Db.Port) + "] Successed")
	}

	db.DB().SetMaxOpenConns(RunTimeConfig.Db.MaxConnect)
	db.DB().SetMaxIdleConns(RunTimeConfig.Db.MaxIdle)

	err = db.AutoMigrate(
		model.User{},
		model.Recomend{},
		model.Sign{},
	).Error

	if err != nil {
		return err
	}

	db.LogMode(RunTimeConfig.Db.Debug)

	model.InitCommonDb(db)

	return nil
}
