package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	fmt.Println("精度", 0.07*100 )

	err := r.Run()
	if err != nil {
		return
	}
}
