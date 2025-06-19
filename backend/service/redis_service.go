package service

import (
	"backend/config"
	"backend/entity"
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
)

// Redis键命名规范
const (
	ArticleViewsKey   = "article:views:%d"   // 文章总阅读量
	ArticleIPKey      = "article:ip:%d_%s"   // IP访问记录
	ArticleContentKey = "article:content:%d" // 文章内容缓存
	OJSubmitRateKey   = "oj:submit:%s"       // OJ提交频率限制
	ViewCountSyncKey  = "sync:views"         // 阅读量同步标识
)

var ctx = context.Background()

// RedisService Redis服务结构体
type RedisService struct{}

// GetArticleViews 获取文章阅读量
func (rs *RedisService) GetArticleViews(articleID uint) (int64, error) {
	key := fmt.Sprintf(ArticleViewsKey, articleID)
	val, err := config.RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		return 0, nil // 键不存在，返回0
	}
	if err != nil {
		return 0, err
	}

	count, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		return 0, err
	}

	return count, nil
}

// IncrementArticleViews 增加文章阅读量（带IP防刷）
func (rs *RedisService) IncrementArticleViews(articleID uint, clientIP string) (bool, error) {
	ipKey := fmt.Sprintf(ArticleIPKey, articleID, clientIP)

	// 检查IP是否在60秒内已访问过
	exists, err := config.RedisClient.Exists(ctx, ipKey).Result()
	if err != nil {
		return false, err
	}

	if exists > 0 {
		return false, nil // IP在限制时间内已访问，不增加阅读量
	}

	// 记录IP访问，60秒过期
	err = config.RedisClient.Set(ctx, ipKey, 1, 60*time.Second).Err()
	if err != nil {
		return false, err
	}

	// 增加文章总阅读量
	viewsKey := fmt.Sprintf(ArticleViewsKey, articleID)
	_, err = config.RedisClient.Incr(ctx, viewsKey).Result()
	if err != nil {
		return false, err
	}

	return true, nil
}

// CheckOJSubmitRateLimit 检查OJ提交频率限制
func (rs *RedisService) CheckOJSubmitRateLimit(clientIP string) (bool, error) {
	key := fmt.Sprintf(OJSubmitRateKey, clientIP)

	// 获取当前提交次数
	count, err := config.RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		// 首次提交，设置计数为1，60秒过期
		err = config.RedisClient.Set(ctx, key, 1, 60*time.Second).Err()
		return true, err
	}
	if err != nil {
		return false, err
	}

	// 解析当前计数
	currentCount, err := strconv.Atoi(count)
	if err != nil {
		return false, err
	}

	// 检查是否超过限制（每分钟5次）
	if currentCount >= 5 {
		return false, nil // 超过限制
	}

	// 增加计数
	_, err = config.RedisClient.Incr(ctx, key).Result()
	return true, err
}

// CacheArticleContent 缓存文章内容（热门文章）
func (rs *RedisService) CacheArticleContent(articleID uint, content string) error {
	key := fmt.Sprintf(ArticleContentKey, articleID)
	return config.RedisClient.Set(ctx, key, content, 10*time.Minute).Err()
}

// GetCachedArticleContent 获取缓存的文章内容
func (rs *RedisService) GetCachedArticleContent(articleID uint) (string, error) {
	key := fmt.Sprintf(ArticleContentKey, articleID)
	return config.RedisClient.Get(ctx, key).Result()
}

// ShouldCacheArticle 判断文章是否应该被缓存（阅读量>100）
func (rs *RedisService) ShouldCacheArticle(articleID uint) (bool, error) {
	views, err := rs.GetArticleViews(articleID)
	if err != nil {
		return false, err
	}
	return views > 100, nil
}

// StartViewCountSyncTask 启动定时同步阅读量任务
func StartViewCountSyncTask() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	log.Println("启动阅读量同步任务，每5分钟执行一次")

	for range ticker.C {
		if err := syncViewCountsToDatabase(); err != nil {
			log.Printf("同步阅读量失败: %v", err)
		}
	}
}

// syncViewCountsToDatabase 同步Redis中的阅读量到数据库
func syncViewCountsToDatabase() error {
	// 使用Redis SCAN获取所有文章阅读量键
	iter := config.RedisClient.Scan(ctx, 0, "article:views:*", 0).Iterator()

	for iter.Next(ctx) {
		key := iter.Val()

		// 提取文章ID
		var articleID uint
		if _, err := fmt.Sscanf(key, "article:views:%d", &articleID); err != nil {
			log.Printf("解析文章ID失败: %s, %v", key, err)
			continue
		}

		// 获取Redis中的阅读量
		redisViews, err := config.RedisClient.Get(ctx, key).Int64()
		if err != nil {
			log.Printf("获取Redis阅读量失败: %v", err)
			continue
		}

		// 同步到数据库
		if err := updateArticleViewsInDB(articleID, redisViews); err != nil {
			log.Printf("同步文章 %d 阅读量到数据库失败: %v", articleID, err)
		} else {
			log.Printf("成功同步文章 %d 阅读量: %d", articleID, redisViews)
		}
	}

	if err := iter.Err(); err != nil {
		return fmt.Errorf("扫描Redis键失败: %v", err)
	}

	return nil
}

// updateArticleViewsInDB 更新数据库中的文章阅读量
func updateArticleViewsInDB(articleID uint, views int64) error {
	// 更新Article表的views字段
	result := config.DB.Model(&entity.Article{}).Where("id = ?", articleID).Update("views", views)
	return result.Error
}
