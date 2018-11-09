package main

import (
	"fmt"
	//	"jugGoServer/test"
	"jugGoServer/server"
	"os"
	"os/signal"
	"runtime"
	"syscall"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()

	fmt.Println("server start !")
	server.Start()

	//	test.TestGorm()

	exitChan := make(chan struct{})
	signalChan := make(chan os.Signal, 1)
	go func() {
		<-signalChan
		close(exitChan)
	}()
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	<-exitChan

	fmt.Println("server end !")

	//server.Stop()
}
