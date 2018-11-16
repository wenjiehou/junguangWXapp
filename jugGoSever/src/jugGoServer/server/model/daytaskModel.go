package model //redis : sadd daytask

import (
	"encoding/json"
)

type Daytask_type uint

const (
	Daytask_type_invite        Daytask_type = 1
	Daytask_type_takeInLottery Daytask_type = 2
	Daytask_type_lucky         Daytask_type = 3
	Daytask_type_playGame      Daytask_type = 4
)

//每日任务数据结构
type Daytask struct {
	Type   Daytask_type `json:"type"`   //任务类型
	Value  uint         `json:"value"`  // 任务完成的量
	Reward uint         `json:"reward"` //任务完成获得的奖励
}

//包装一下，用来反应用户完成每日任务情况的
type DaytaskUser struct {
	Daytask
	CompNum uint `json:"compNum"`
}

func (daytask *Daytask) Marshal() string { //转化成json类型,按道理说，这种序列化应该不会很消耗性能
	data, err := json.Marshal(daytask)
	if err != nil {
		return ""
	} else {
		return string(data)
	}

}

func Unmarshal(data []byte) *Daytask { //转化成类
	retData := &Daytask{}

	err := json.Unmarshal(data, retData)
	if err != nil {
		return nil
	} else {
		return retData
	}
}
