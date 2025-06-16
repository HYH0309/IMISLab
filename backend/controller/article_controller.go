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

// GetArticleByID 根据ID获取文章详情
func GetArticleByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的文章ID")
		return
	}

	article, err := service.GetArticleByID(uint(id))
	if err != nil {
		utils.Fail(c, http.StatusNotFound, "文章不存在")
		return
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
