package server

import (
	"fmt"

	"github.com/robfig/cron"
)

//初始化定时任务计划
func InitCrontab() {
	c := cron.New()
	spec := "0 0 0 * * ?" //每天0点通知奖励
	c.AddFunc(spec, NoticeLotteryResult)

}

//通知发放奖励
func NoticeLotteryResult() { //用一个通道通知一下，另一边 for 读这个chan就好了
	fmt.Println("NoticeLotteryResult...")
	//todo
}
