package main

import (
	"backend/config"
	"backend/middleware"
	"backend/router"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// 初始化数据库
	config.InitDB()

	// 创建Gin实例
	r := gin.Default()

	// 设置中间件
	r.Use(middleware.SetupCORS())
	r.Use(middleware.Logger())
	r.Use(gin.Recovery())

	// 设置路由
	router.SetupRoutes(r)

	// 获取端口号
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3344"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
