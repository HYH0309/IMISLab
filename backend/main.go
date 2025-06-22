package main

import (
	"backend/config"
	"backend/middleware"
	"backend/router"
	"backend/service"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}
	// 根据环境变量设置Gin模式
	mode := os.Getenv("GIN_MODE")
	if mode == "" {
		mode = gin.ReleaseMode // 默认为发行模式
	}
	gin.SetMode(mode)

	// 初始化数据库
	config.InitDB()

	// 初始化Redis
	config.InitRedis()

	// 启动定时同步阅读量任务
	go service.StartViewCountSyncTask()

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

	// 优雅关闭
	go func() {
		log.Printf("Server starting on port %s", port)
		if err := r.Run(":" + port); err != nil {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// 等待中断信号优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// 关闭Redis连接
	config.CloseRedis()

	log.Println("Server exited")
}
