package config

import (
	"backend/entity"
	"context"
	"fmt"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var RedisClient *redis.Client

// InitDB 初始化数据库连接
func InitDB() {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		getEnv("DB_USER", "root"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "3306"),
		getEnv("DB_NAME", "imislab"))

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	// 自动迁移数据库表结构
	err = DB.AutoMigrate(
		&entity.Article{},
		&entity.Tag{},
		&entity.Comment{},
		&entity.OJProblem{},
		&entity.OJTestcase{},
		&entity.Submission{},
	)
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}

	fmt.Println("Database connected successfully!")
}

// InitRedis 初始化Redis连接
func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:         getEnv("REDIS_HOST", "localhost") + ":" + getEnv("REDIS_PORT", "6379"),
		Password:     getEnv("REDIS_PASSWORD", ""), // Redis密码，默认为空
		DB:           0,                            // Redis数据库索引
		PoolSize:     10,                           // 连接池大小
		MinIdleConns: 2,                            // 最小空闲连接数
		MaxRetries:   3,                            // 最大重试次数
		DialTimeout:  5 * time.Second,              // 连接超时
		ReadTimeout:  3 * time.Second,              // 读取超时
		WriteTimeout: 3 * time.Second,              // 写入超时
	})

	// 测试Redis连接
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pong, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		panic("failed to connect redis: " + err.Error())
	}

	fmt.Printf("Redis connected successfully! Response: %s\n", pong)
}

// CloseRedis 关闭Redis连接
func CloseRedis() {
	if RedisClient != nil {
		RedisClient.Close()
		fmt.Println("Redis connection closed.")
	}
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
