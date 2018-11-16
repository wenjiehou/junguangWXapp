package controller

import (
	"encoding/json"
	"fmt"
	"jugGoServer/net/ipc"
	"time"

	"jugGoServer/model"

	"bytes"

	"net/http"

	"jugGoServer/myconst"

	"github.com/garyburd/redigo/redis"
	"github.com/robfig/cron"
)

const (
	sigleTaskTime = 100 * time.Millisecond
)

var middleServer *ipc.MiddleServer

//初始化定时任务计划
func InitCrontab() {
	middleServer = ipc.GetMiddleServer() //这里后面改成使用标准ipc，暂时先用着
	if myconst.NeedClearDaytaskComp == true {
		Redis_DelDaytaskComp()
	}
	time.Sleep(10 * time.Second)

	c := cron.New()
	spec := "0 0 */1 * * ?" //一小时执行一次就好了
	c.AddFunc(spec, NoticeTask)
	c.Start()

}

//通知发放奖励
func NoticeTask() { //用一个通道通知一下，另一边 for 读这个chan就好了
	fmt.Println("NoticeTask...")
	now := time.Now()
	hour := now.Hour()
	timeStr := now.Format("2006-01-02")
	today, _ := time.ParseInLocation("2006-01-02", timeStr, time.Local) //今天的凌晨
	//	fmt.Println("NoticeTask hour::", hour, timeStr)

	if hour == 0 { //凌晨
		go Redis_DelDaytaskComp() //这里有一个服务器重启的问题，服务器重启不能跨过凌晨
	}

	go NoticeSignRecom(today, hour) //这里是执行签到提醒的

	//todo
}

//签到提醒 取当前整点要提醒的玩家列表，如果玩家已经签到过了，就不管；如果玩家没有签到，就取formid，如果取到了，就发签到提醒；如果没有formid，从列表中删除
func NoticeSignRecom(today time.Time, t int) {
	recomd := Redis_ReadSignRecom(t) //这个小时要提醒的玩家

	idx := -1

	length := len(recomd)

	//	fmt.Println("recomd length::", recomd)

	template_id := "gwUf85Bkyw_GsIIopS-YoONkUzJNDJbBmLm2-8lBNNg"

	for {
		idx++
		if idx < length {
			//			fmt.Println("NoticeSignRecom::1")
			v := recomd[idx]
			openid, err := redis.String(v, nil)
			if err != nil {

				continue
			}
			//			fmt.Println("NoticeSignRecom::2")
			access_token := middleServer.AccessToken //这个还是现取吧，这里可能会有问题的
			formId := Redis_ReadSignRecomFormId(openid)
			//			fmt.Println("formId::", formId)
			if formId == "" {

				continue
			}
			//			fmt.Println("NoticeSignRecom::3")
			//看看这个家伙有没有签到过，签到了就不发了
			user, _ := model.GetUserModel().GetUserByOpenId(openid)
			if user == nil {
				continue
			}
			//			fmt.Println("NoticeSignRecom::4")
			sign, _ := model.GetSignModel().GetSignByUserId(user.ID)
			if sign == nil {
				continue
			}
			//			fmt.Println("NoticeSignRecom::5")

			if sign.LastTime != nil { //说明之前签到过                               //昨天的凌晨 yesterday
				if sign.LastTime.After(today) == true { //今天签到过
					continue
				}
			}
			//			fmt.Println("NoticeSignRecom::6")
			//给玩家发送签到提醒
			postData := &struct {
				Touser           string      `json:"touser"`
				Template_id      string      `json:"template_id"`
				Page             string      `json:"page"`
				Form_id          string      `json:"form_id"`
				Data             interface{} `json:"data"`
				Emphasis_keyword string      `json:"emphasis_keyword"`
			}{
				Touser:      openid,
				Template_id: template_id,
				Page:        "pages/preload/preload?toPage=pages/profit/profit",
				Form_id:     formId,
				Data: &struct {
					Keyword1 interface{} `json:"keyword1"`
					Keyword2 interface{} `json:"keyword2"`
					Keyword3 interface{} `json:"keyword3"`
				}{
					Keyword1: &struct {
						Value string `json:"value"`
					}{
						Value: "每日签到",
					},
					Keyword2: &struct {
						Value string `json:"value"`
					}{
						Value: "签到福利在等你哦",
					},
					Keyword3: &struct {
						Value string `json:"value"`
					}{
						Value: "福利转，转转转",
					},
				},
				//				Emphasis_keyword: "keyword2.DATA",
			}

			jsonStr, jerr := json.Marshal(postData)
			if jerr != nil { //解析错了也不要管
				continue
			}

			//			fmt.Println("jsonStr:", string(jsonStr))
			var url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + access_token
			req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
			req.Header.Set("Content-Type", "application/json")

			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				panic(err)
			}
			defer resp.Body.Close()

			//			body, _ := ioutil.ReadAll(resp.Body)
			//			fmt.Println("response Body:", string(body))

		} else {
			break
		}

		time.Sleep(sigleTaskTime) //100ms 处理一个提醒
	}

}
