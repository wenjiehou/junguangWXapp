//签到相关的都在这里
package httpServer

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"jugGoServer/model"
	"jugGoServer/server/controller"
	"net/http"
	"strconv"
	"strings"
	"time"
)

//迁移的时候，记得执行以下命令初始化数据
//rpush signConfig 10 20 30 40 50 60 70

//获取签到配置数据
func getSignData(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //解析参数，默认是不会解析的
	var wxkey string

	for k, v := range r.Form {
		switch k {
		case "wxkey":
			wxkey = strings.Join(v, "")
			//todo
		}
	}
	user := getUserByWxkey(wxkey)
	if user != nil {
		signConfig := controller.Redis_ReadSignConfig(wxkey)
		//我们需要两个数据 一个是当前连续签到的天数 一个是今天是否已经签到

		timeStr := time.Now().Format("2006-01-02")
		today, _ := time.ParseInLocation("2006-01-02", timeStr, time.Local) //今天的凌晨
		yesterday := today.AddDate(0, 0, -1)                                //昨天的凌晨 yesterday
		//		tomorrow := today.AddDate(0, 0, 1)                                  //明天的凌晨 tomorrow

		//拉取个人签到信息
		sign, _ := model.GetSignModel().GetSignByUserId(user.ID)
		//		fmt.Println("sige::", sign)
		if sign == nil {
			sign = &model.Sign{
				UserID:   user.ID,
				Sum:      0,
				Continue: 0,
			}
			err := model.GetSignModel().Save(sign)
			if err != nil {
				fmt.Println("save sign failed ::", err)
				v, _ := json.Marshal(&ReqResult{
					Data:     "save sign failed",
					Code:     1,
					ErrorMsg: err.Error(),
				})
				fmt.Fprintf(w, string(v))

				return
			}
		}

		var todaySigned = false

		if sign.LastTime != nil { //说明之前签到过
			//看他最后一次签到的时间，如果在昨天的零点之前，那么就清除之前的连续签到次数
			if sign.LastTime.Before(yesterday) == true { //最后一次签到是昨天之前，
				sign.Continue = 0 //这里不需要保存到数据库，因为前端没有请求签到，只是获取签到数据
				//				fmt.Println("Before yesterday signed true", sign.LastTime.Format("2006-01-02"))
			} else if sign.LastTime.Before(today) {
				todaySigned = false
			} else {
				todaySigned = true
			}
		}

		//后端只维护数据，展示前端去弄吧
		var Conti uint = 0
		if sign.Continue == 7 && todaySigned == false { //如果今天还没有签到，就已经连续签到7天了，给前端展示0
			Conti = 0
		} else {
			Conti = sign.Continue
		}

		v, _ := json.Marshal(&ReqResult{
			Data: &struct {
				Config interface{} `json:"config"`
				Signed bool        `json:"signed"`
				Conti  uint        `json:"conti"`
			}{
				Config: signConfig,
				Signed: todaySigned,
				Conti:  Conti,
			},
			Code: 0,
		})
		fmt.Fprintf(w, string(v))
	}

}

//个人签到接口 post
func reqSign(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var signMode = &SignModel{}
	fmt.Println("reqSign", string(body))
	err := json.Unmarshal(body, signMode)
	if err == nil { //解析成功了
		user := getUserByWxkey(signMode.Wxkey)

		fmt.Println("reqSign::", user)

		if user != nil {
			sign, _ := model.GetSignModel().GetSignByUserId(user.ID)
			if sign != nil { //有sign数据，没有的不用管，妈的，不是走我的流程
				timeStr := time.Now().Format("2006-01-02")
				today, _ := time.ParseInLocation("2006-01-02", timeStr, time.Local) //今天的凌晨
				yesterday := today.AddDate(0, 0, -1)
				var todaySigned = false
				if sign.LastTime != nil { //说明之前签到过                               //昨天的凌晨 yesterday
					if sign.LastTime.After(today) == true {
						todaySigned = true
						//						fmt.Println("after today signed true", sign.LastTime.Format("2006-01-02"))
					}
				}

				if todaySigned == false {
					db_user, _ := model.GetUserModel().GetUserById(user.ID)

					if sign.LastTime != nil {
						if sign.LastTime.Before(yesterday) == true { //
							sign.Continue = 1
						} else {
							sign.Continue += 1
							sign.Continue = sign.Continue % 7 //
						}
					} else {
						sign.Continue = 1
					}

					sign.Sum += 1 //只要签到了，签到总数就加1

					var now = time.Now()
					sign.LastTime = &now

					if db_user != nil {
						m := model.BeginCommit()

						if err := model.GetSignModel().Save(sign); err != nil {
							m.Rollback()
							v, _ := json.Marshal(&ReqResult{
								Code:     1,
								ErrorMsg: err.Error(),
							})
							fmt.Fprintf(w, string(v))
							return
						}

						signConfig := controller.Redis_ReadSignConfig(signMode.Wxkey)
						increase, serr := strconv.Atoi(signConfig[strconv.Itoa(int(sign.Continue))])
						if serr == nil {
							db_user.Credit += uint(increase)
						}

						//						fmt.Println("sign sucess::", db_user.Credit)

						if err := model.GetUserModel().Save(db_user); err != nil {
							m.Rollback()
							v, _ := json.Marshal(&ReqResult{
								Code:     1,
								ErrorMsg: err.Error(),
							})
							fmt.Fprintf(w, string(v))
							return
						}
						m.Commit()
						user.Credit = db_user.Credit
						controller.Redis_CatchUserInfo(user)
					}
				}
				v, _ := json.Marshal(&ReqResult{
					Data: &struct {
						Credit uint `json:"credit"`
						Signed bool `json:"signed"`
						Conti  uint `json:"conti"`
					}{
						Credit: user.Credit,
						Signed: true,
						Conti:  sign.Continue,
					},
					Code: 0,
				})
				fmt.Fprintf(w, string(v))

			}
		}
	}
}

//请求签到提醒 post  提醒 recomSign6 ...  [openid]list
func signRecom(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)

	recomData := &struct {
		Wxkey     string `json:"wxkey"`
		FormId    string `json:"formId"`
		RecomTime int    `json:"recomTime"` //
	}{}

	err := json.Unmarshal(body, recomData)
	if err == nil {
		user := getUserByWxkey(recomData.Wxkey)
		if user != nil {

			fmt.Println("recomData.RecomTime::", recomData.RecomTime)

			catch := controller.Redis_CatchSignRecom(user.Openid, user.Wxkey, recomData.RecomTime, recomData.FormId)

			fmt.Println("catch recomSign::", catch)

			if catch == true {
				v, _ := json.Marshal(&ReqResult{
					Data: "signRecom sucess",
					Code: 0,
				})
				fmt.Fprintf(w, string(v))
			} else {
				v, _ := json.Marshal(&ReqResult{
					Data:     "signRecom failed",
					Code:     1,
					ErrorMsg: "redis catch failed",
				})
				fmt.Fprintf(w, string(v))
			}
		}
	} else {
		v, _ := json.Marshal(&ReqResult{
			Data:     "signRecom failed",
			Code:     1,
			ErrorMsg: err.Error(),
		})
		fmt.Fprintf(w, string(v))
	}

	//如果今天玩家没有签到，玩家对应的 sign
}
