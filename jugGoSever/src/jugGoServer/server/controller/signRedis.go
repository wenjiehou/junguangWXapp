package controller

import (
	"fmt"
	"strconv"

	"github.com/garyburd/redigo/redis"
)

const (
	signConfig = "signConfig" //签到奖励配置的列表
	signRecom  = "signRecom_" //签到提醒对应的表前缀
//	formId     = "formId"
)

//从redis中读取签到的配置
func Redis_ReadSignConfig(wxkey string) map[string]string {

	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return nil
	}

	conn.Do("expire", wxkey, 1800) //失败了也没有关系
	values, err := redis.Values(conn.Do("lrange", "signConfig", "0", "-1"))

	if err == nil {
		retArr := make(map[string]string, 0)

		for i, v := range values {
			retArr[strconv.Itoa(i+1)], _ = redis.String(v, nil)
		}

		//		fmt.Println("signConfig::", retArr)

		return retArr
	}
	return nil
}

//redis 存入玩家提醒签到 t提醒的整点时间 比如 6  dayStr 年月日
func Redis_CatchSignRecom(openid string, wxkey string, t int, formId string) bool { //这里需要写事物
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return false
	}
	conn.Do("expire", wxkey, 1800) //失败了也没有关系

	conn.Do("multi")
	//先缓存推荐的formId
	conn.Do("del", signRecom+openid+"formId")           //目前就缓存一个吧
	conn.Do("rpush", signRecom+openid+"formId", formId) //读取用lpop
	for i := 6; i < 23; i++ {
		if i == t { //是当前的集合加入
			fmt.Println("tttt:", t)
			conn.Do("sadd", signRecom+strconv.Itoa(i), openid)
		} else { //不是当前的集合，删除
			conn.Do("srem", signRecom+strconv.Itoa(i), openid)
		}
	}
	_, execerr := conn.Do("exec")
	if execerr != nil {
		return false
	}
	return true
}

//获取某个整点需要提醒签到的玩家列表
func Redis_ReadSignRecom(t int) []interface{} { //这里后期多服务器的话要考虑使用事物
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return nil
	}
	values, verr := redis.Values(conn.Do("smembers", signRecom+strconv.Itoa(t)))
	if verr == nil {

		//		fmt.Println("Redis_ReadSignRecom::", values)

		return values
	}
	return nil
}

//获取玩家的推荐formId
func Redis_ReadSignRecomFormId(openid string) string {
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return ""
	}

	v, e := conn.Do("lpop", signRecom+openid+"formId") //读取用
	if e != nil {
		return ""
	} else {
		retStr, serr := redis.String(v, nil)
		if serr != nil {
			return ""
		} else {
			return retStr
		}
	}
	return ""
}
