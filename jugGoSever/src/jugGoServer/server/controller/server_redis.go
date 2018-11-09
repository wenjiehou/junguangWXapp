package controller

import (
	"encoding/json"
	"fmt"

	"jugGoServer/model"
	"time"

	"github.com/garyburd/redigo/redis"
)

var (
	RedisPool *redis.Pool
	RedisConn redis.Conn
)

// 初始化RedisDb
func Redis_InitRedisDb(address, password string, maxIdle, maxActive, idleTimeOut int) (*redis.Pool, error) {
	RedisPool = &redis.Pool{
		MaxIdle:     30,
		MaxActive:   100,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", address)
			if err != nil {
				return nil, err
			}
			return c, err
		},
	}
	RedisConn, _ = RedisPool.Dial()
	if RedisPool != nil && RedisConn != nil {
		fmt.Println("Connect RedisDB [" + address + "] Successed")
	} else {
		fmt.Println("Connect RedisDB [" + address + "] Error ")
	}
	return RedisPool, nil
}

// 清空Redis RoomKey
func Redis_ClearRedis() {
	//todo
	_, err := RedisPool.Dial()
	if err != nil {
		fmt.Println("Redis conn err ::", err)
		return
	} else {
		//flushdb 删除当前数据库中的所有Key
		//flushall 删除所有数据库中的key
		//v, err := conn.Do("flushall")
		//fmt.Println("v:", v, "err:", err)
	}

	//	v, err := conn.Do("keys", "room:*")
	//	if err != nil {
	//		fmt.Println("Error ", err)
	//		return
	//	} else {
	//	}
}

//缓存一个玩家的信息到redis中,并且设置过期时间，各种请求优先从redis读取，没有的话，从数据库读取，服务器挂了也没有事
func Redis_CatchUserInfo(user *model.User) bool {
	conn, err := RedisPool.Dial()
	if err != nil {
		fmt.Println("Redis conn err ::", err)
		return false
	}

	//fmt.Println("Redis_CatchPlayerInfo::", user)

	userByte, e := json.Marshal(user)
	if e == nil {
		userStr := string(userByte)
		//		fmt.Println("res_inset userinfo", userStr)
		conn.Do("multi")                                  //通知事物列队
		conn.Do("hset", user.Openid, "userinfo", userStr) //这里失败了就失败了吧，失败了从数据库在读，只要保证正常没有问题就好了
		conn.Do("expire", user.Openid, 3600)              //我们暂时设置1小时过期
		conn.Do("exec")                                   //执行
		return true
	}
	return false
}

//从redis 缓存中读取玩家的信息
func Redis_ReadUserInfo(openid string) *model.User {
	conn, err := RedisPool.Dial()
	if err != nil {
		fmt.Println("Redis conn err ::", err)
		return nil
	}

	v, err := conn.Do("hget", openid, "userinfo")
	if err == nil && v != nil {
		s, _ := redis.String(v, nil)

		str := []byte(s)
		user := &model.User{}
		jerr := json.Unmarshal(str, user)
		if jerr != nil {
			return nil
		}
		//		fmt.Println("userinfo::", user)
		return user
	}
	return nil
}
