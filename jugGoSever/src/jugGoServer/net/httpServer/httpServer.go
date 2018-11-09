package httpServer

import (
	"fmt"
	"net/http"
	"strconv"
)

func StartHttp(ip string, port int) {

	http.HandleFunc("/v1/login", login)                 //登录请求
	http.HandleFunc("/v1/updateSession", updateSession) //session_key过期了，请求刷新

	err := http.ListenAndServe(ip+":"+strconv.Itoa(port), nil)
	if err != nil {
		panic(err)
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "login")
}

func updateSession(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "updateSession")
}
