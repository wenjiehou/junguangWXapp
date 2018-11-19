package httpServer //这里是每日任务  redis配置 hset everydayTask

import (
	"encoding/json"
	"fmt"
	"jugGoServer/model"
	"jugGoServer/server/controller"
	c_model "jugGoServer/server/model"
	"net/http"
	"strings"
	"time"
)

//获取每日任务
func getDaytask(w http.ResponseWriter, r *http.Request) {
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
		tasks := controller.Redis_ReadDaytasks()

		if tasks == nil { //获取每日任务配置失败
			v, _ := json.Marshal(&ReqResult{
				Data: "getDaytask config failed",
				Code: 1,
			})
			fmt.Fprintf(w, string(v))
		}

		length := len(tasks)
		taskUsers := make([]*c_model.DaytaskUser, 0, length)

		for _, v := range tasks {
			taskUser := &c_model.DaytaskUser{
				CompNum: 0,
			}

			comp := controller.Redis_ReadDaytaskComp(user.ID, v.Type, v.Value)
			if comp == true {
				taskUser.CompNum = 1
			} else {
				//这里不处理，比较耗性能
			}

			taskUser.Type = v.Type
			taskUser.Value = v.Value
			taskUser.Reward = v.Reward
			taskUsers = append(taskUsers, taskUser)
		}

		v, _ := json.Marshal(&ReqResult{
			Data: taskUsers,
			Code: 0,
		})

		fmt.Fprintf(w, string(v))

	}
}

//更新每日任务完成情况
func updateUserDaytask(user *model.User) {
	//判断 FromUserId 推荐一个好友的每日任务有没有完成

	if user == nil {
		fmt.Println("updateUserDaytask not find user id::", user)
		return
	}
	daytasks := controller.Redis_ReadDaytasks()

	timeStr := time.Now().Format("2006-01-02")
	today, _ := time.ParseInLocation("2006-01-02", timeStr, time.Local) //今天的凌晨
	for _, task := range daytasks {
		if task.Type == c_model.Daytask_type_invite { //邀请好友的每日任务
			comp := controller.Redis_ReadDaytaskComp(user.ID, task.Type, task.Value)
			if comp == true { //已经完成，就不管了
				continue
			} else {
				//我们看看这个玩家推荐的人数是不是大于当前的值,并且是今天推荐的

				if user == nil {

				}
				recomends := user.Recomends

				fmt.Println("recomends::", recomends)

				if recomends == nil || len(recomends) == 0 {
					continue
				}

				var todayNum uint = 0

				for _, rec := range recomends {
					if rec.CreatedAt.After(today) {
						todayNum += 1
					}
				}
				if todayNum >= task.Value { //达成目标了

					controller.Redis_CatchDaytaskComp(user.ID, task.Type, task.Value)
					user.Credit += task.Reward
				}
			}

		} else {

		}

	}

	saveErr := model.GetUserModel().Save(user)

	if saveErr != nil {
		fmt.Println("Redis_CatchDaytaskComp GetUserModel failed ::jiaqia ::", saveErr.Error())
	} else {
		controller.Redis_CatchUserInfo(user)
	}
}
