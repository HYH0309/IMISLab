package controller

import (
	"backend/dto"
	"backend/service"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateArticle 创建文章
func CreateArticle(c *gin.Context) {
	var req dto.ArticleCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	article, err := service.CreateArticle(req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "创建文章失败: "+err.Error())
		return
	}

	utils.Success(c, article, "文章创建成功")
}

// GetArticles 获取文章列表
func GetArticles(c *gin.Context) {
	// 获取分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	articles, err := service.GetArticleList(page, pageSize)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "获取文章列表失败: "+err.Error())
		return
	}

	utils.Success(c, articles, "")
}

// GetArticleByID 根据ID获取文章详情（带阅读量统计）
func GetArticleByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的文章ID")
		return
	}

	// 获取客户端IP
	clientIP := c.ClientIP()

	// 使用Redis服务增加阅读量（带防刷机制）
	redisService := &service.RedisService{}
	viewIncremented, err := redisService.IncrementArticleViews(uint(id), clientIP)
	if err != nil {
		// Redis失败不影响文章获取，仅记录日志
		utils.LogError("Redis阅读量统计失败", err)
	}

	// 首先尝试从Redis缓存获取文章内容
	cachedContent, err := redisService.GetCachedArticleContent(uint(id))
	if err == nil && cachedContent != "" {
		// 缓存命中，解析JSON并更新阅读量
		var cachedArticle dto.ArticleResponse
		if parseErr := utils.ParseJSONString(cachedContent, &cachedArticle); parseErr == nil {
			// 获取Redis中的最新阅读量
			if redisViews, viewErr := redisService.GetArticleViews(uint(id)); viewErr == nil {
				cachedArticle.Views = redisViews
			}

			// 在响应头中添加阅读量是否增加的信息
			if viewIncremented {
				c.Header("X-View-Incremented", "true")
			}
			c.Header("X-Cache-Hit", "true")

			utils.Success(c, cachedArticle, "")
			return
		}
	}

	// 缓存未命中，从数据库获取
	article, err := service.GetArticleByID(uint(id))
	if err != nil {
		utils.Fail(c, http.StatusNotFound, "文章不存在")
		return
	}

	// 获取Redis中的实时阅读量
	redisViews, err := redisService.GetArticleViews(uint(id))
	if err == nil {
		// 更新文章的阅读量为Redis中的值
		article.Views = redisViews
	}

	// 检查是否应该缓存这篇文章（阅读量>100）
	shouldCache, err := redisService.ShouldCacheArticle(uint(id))
	if err == nil && shouldCache {
		// 将文章内容缓存到Redis
		if err := redisService.CacheArticleContent(uint(id), utils.ToJSONString(article)); err != nil {
			utils.LogError("缓存文章内容失败", err)
		}
	}

	// 在响应头中添加阅读量是否增加的信息
	if viewIncremented {
		c.Header("X-View-Incremented", "true")
	}

	utils.Success(c, article, "")
}

// UpdateArticle 更新文章
func UpdateArticle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的文章ID")
		return
	}

	var req dto.ArticleUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	article, err := service.UpdateArticle(uint(id), req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "更新文章失败: "+err.Error())
		return
	}

	utils.Success(c, article, "文章更新成功")
}

// DeleteArticle 删除文章
func DeleteArticle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的文章ID")
		return
	}

	err = service.DeleteArticle(uint(id))
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "删除文章失败: "+err.Error())
		return
	}

	utils.Success(c, nil, "文章删除成功")
}
