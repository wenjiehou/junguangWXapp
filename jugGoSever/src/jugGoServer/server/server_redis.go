package server

import (
	"fmt"

	"github.com/garyburd/redigo/redis"
)

var (
	RedisPool *redis.Pool
	RedisConn redis.Conn
)

// 初始化RedisDb
func Redis_InitRedisDb(address, password string, maxIdle, maxActive, idleTimeOut int) (*redis.Pool, error) {
	RedisPool = &redis.Pool{
		MaxIdle:     0,
		MaxActive:   1000,
		IdleTimeout: 0,
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

func GetRedisConn() (redis.Conn, error) {
	return RedisPool.Dial()
}

// 清空Redis RoomKey
func Redis_ClearRedis() {
	//todo

}
