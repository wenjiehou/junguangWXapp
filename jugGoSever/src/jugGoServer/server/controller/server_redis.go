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

//构造一个链接函数，如果没有密码，passwd为空字符串
func redisConn(address, passwd string) (redis.Conn, error) {
	c, err := redis.Dial("tcp",
		address,
		redis.DialConnectTimeout(5*time.Second),
		redis.DialReadTimeout(1*time.Second),
		redis.DialWriteTimeout(1*time.Second),
		redis.DialPassword(passwd),
		redis.DialKeepAlive(1*time.Second),
	)
	return c, err
}

//构造一个连接池
//url为包装了redis的连接参数ip,port,passwd
func newPool(address, passwd string, maxIdle, maxActive int) *redis.Pool {
	return &redis.Pool{
		MaxIdle:         maxIdle,   //定义redis连接池中最大的空闲链接为3
		MaxActive:       maxActive, //在给定时间已分配的最大连接数(限制并发数)
		IdleTimeout:     240 * time.Second,
		MaxConnLifetime: 300 * time.Second,
		Dial:            func() (redis.Conn, error) { return redisConn(address, passwd) },
	}
}

// 初始化RedisDb 发布和订阅暂时没有需求 一个客户端发布了一个channel 就是redis的key 另一个客户端可以订阅，订阅者可以收到发布者发布的信息
func Redis_InitRedisDb(address, password string, maxIdle, maxActive, idleTimeOut int) (*redis.Pool, error) {
	RedisPool = newPool(address, password, maxIdle, maxActive)

	//	RedisPool.Get()
	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() == nil {
		fmt.Println("Redis success !!")
	} else {
		fmt.Println("Redis failed !!::", conn.Err())
	}

	return RedisPool, nil
}

func Redis_initData() {
	Redis_InitSignConfig()
	Redis_InitDaytasks()
}

// 清空Redis RoomKey
func Redis_ClearRedis() {
	//reddis数据应该是不需要清的
	//todo
	//	_, err := RedisPool.Dial()
	//	if err != nil {
	//		fmt.Println("Redis conn err ::", err)
	//		return
	//	} else {
	//flushdb 删除当前数据库中的所有Key
	//flushall 删除所有数据库中的key
	//v, err := conn.Do("flushall")
	//fmt.Println("v:", v, "err:", err)
	//	}

	//	v, err := conn.Do("keys", "room:*")
	//	if err != nil {
	//		fmt.Println("Error ", err)
	//		return
	//	} else {
	//	}
}

//缓存一个玩家的信息到redis中,并且设置过期时间，各种请求优先从redis读取，没有的话，从数据库读取，服务器挂了也没有事
func Redis_CatchUserInfo(user *model.User) bool {

	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return false
	}

	userByte, e := json.Marshal(user)
	if e == nil {
		userStr := string(userByte)
		//		fmt.Println("res_inset userinfo", userStr)
		conn.Do("multi")                                 //通知事物列队
		conn.Do("hset", user.Wxkey, "userinfo", userStr) //这里失败了就失败了吧，失败了从数据库在读，只要保证正常没有问题就好了
		//		conn.Do("set", user.Openid, user.Wxkey)          //建立 Openid => Wxkey 不设置过期时间，每个用户一份
		conn.Do("expire", user.Wxkey, 1800) //我们暂时设置1小时过期

		_, execerr := conn.Do("exec") //执行
		if execerr != nil {
			return false
		}
		return true
	}
	return false
}

//从redis 缓存中读取玩家的信息
func Redis_ReadUserInfo(wxkey string) *model.User {

	conn := RedisPool.Get()
	defer conn.Close()

	if conn.Err() != nil {
		fmt.Println("Redis conn err ::", conn.Err())
		return nil
	}

	v, err := conn.Do("hget", wxkey, "userinfo")
	if err == nil && v != nil {
		conn.Do("expire", wxkey, 1800) //失败了也没有关系，读一次内存，就更新下过期时间
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
