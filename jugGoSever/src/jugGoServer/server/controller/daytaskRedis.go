package controller

import (
	"fmt"
	"strconv"

	"jugGoServer/server/model"

	"github.com/garyburd/redigo/redis"
)

//var t = model.Daytask{}

//设置每日任务，后台配置，暂时省略

//初始化每日任务
func Redis_InitDaytasks() bool {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("redis pool getConn failed::", conn.Err())
		return false
	}

	v, err := conn.Do("exists", "daytask")
	if err != nil {
		fmt.Println("Redis_InitDaytasks failed", err.Error())
		return false
	}

	exists, _ := redis.Bool(v, nil)
	if exists == true {
		fmt.Println("Redis_InitDaytasks success")
		return true
	} else {
		//没有每日任务，在这里初始化
		task1 := &model.Daytask{
			Type:   model.Daytask_type_invite,
			Value:  1,
			Reward: 50,
		}

		task2 := &model.Daytask{
			Type:   model.Daytask_type_invite,
			Value:  3,
			Reward: 150,
		}

		task3 := &model.Daytask{
			Type:   model.Daytask_type_takeInLottery,
			Value:  1,
			Reward: 20,
		}

		task4 := &model.Daytask{
			Type:   model.Daytask_type_lucky,
			Value:  1,
			Reward: 50,
		}

		task5 := &model.Daytask{
			Type:   model.Daytask_type_playGame,
			Value:  1,
			Reward: 50,
		}

		conn.Do("multi")

		conn.Do("sadd", "daytask", task1.Marshal(), task2.Marshal(), task3.Marshal(), task4.Marshal(), task5.Marshal())

		_, eerr := conn.Do("exec")

		if eerr != nil {
			fmt.Println("Redis_InitDaytasks failed::", eerr.Error())
			return false
		} else {
			fmt.Println("Redis_InitDaytasks success")
			return true
		}

	}

	return false
}

//读取每日任务配置
func Redis_ReadDaytasks() []*model.Daytask {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("redis pool getConn failed::", conn.Err())
		return nil
	}

	values, err := redis.Values(conn.Do("smembers", "daytask"))

	if err != nil {
		fmt.Println("Redis_ReadDaytasks::", err)
		return nil
	}

	var tasks = make([]*model.Daytask, 0, len(values)) //直接搞一个样大的，就不会有内存重新分配
	for _, v := range values {
		str, _ := redis.String(v, nil)
		//		fmt.Println(str)
		if str != "" {
			tasks = append(tasks, model.Unmarshal([]byte(str)))
		}
	}

	//	fmt.Println("tasks::", tasks)

	return tasks

}

//缓存每日任务中对应完成的表中有没有该玩家
func Redis_CatchDaytaskComp(userId uint, t model.Daytask_type, v uint) bool {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("redis pool getConn failed::", conn.Err())
		return false
	}

	_, err := conn.Do("sadd", "daytask_"+strconv.Itoa(int(t))+"_"+strconv.Itoa(int(v)), userId) //记录玩家对应任务的完成

	if err != nil {
		fmt.Println("Redis_CatchDaytaskComp failed::", err.Error())
		return false
	}

	return true
}

//读取每日任务中对应完成的表中有没有该玩家
func Redis_ReadDaytaskComp(userId uint, t model.Daytask_type, v uint) bool {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("redis pool getConn failed::", conn.Err())
		return false
	}

	ev, err := conn.Do("exists", "daytask_"+strconv.Itoa(int(t))+"_"+strconv.Itoa(int(v)))
	if err != nil {
		fmt.Println("Redis_ReadDaytaskComp failed", err.Error())
		return false
	}

	exists, _ := redis.Bool(ev, nil)
	if exists == false {
		fmt.Println("Redis_ReadDaytaskComp refer table unfind！！")
		return false
	}
	value, _ := conn.Do("sismember", "daytask_"+strconv.Itoa(int(t))+"_"+strconv.Itoa(int(v)), userId)

	if value != nil {
		ret, _ := redis.Int(value, nil)
		if ret == 1 { //存在，说明已经完成，无需判断了
			return true
		} else {
			return false
		}
	}
	return false
}

//删除所有每日任务完成情况，每天凌晨执行
func Redis_DelDaytaskComp() bool {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("redis pool getConn failed::", conn.Err())
		return false
	}

	values, err := redis.Values(conn.Do("smembers", "daytask"))

	if err != nil {
		fmt.Println("Redis_ReadDaytasks::", err)
		return false
	}

	var tasks = make([]*model.Daytask, 0, len(values)) //直接搞一个样大的，就不会有内存重新分配
	for _, v := range values {
		str, _ := redis.String(v, nil)
		if str != "" {
			tasks = append(tasks, model.Unmarshal([]byte(str)))
		}
	}
	conn.Do("multi")

	for _, t := range tasks {
		conn.Do("del", "daytask_"+strconv.Itoa(int(t.Type))+"_"+strconv.Itoa(int(t.Value)))
	}

	_, execErr := conn.Do("exec")
	if execErr != nil {
		return false
	} else {
		return true
	}

}
