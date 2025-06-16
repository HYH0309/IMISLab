package controller

import (
	"backend/dto"
	"backend/service"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateComment 创建评论
func CreateComment(c *gin.Context) {
	var req dto.CommentCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	comment, err := service.CreateComment(req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "创建评论失败: "+err.Error())
		return
	}

	utils.Success(c, comment, "评论创建成功")
}

// GetCommentsByArticleID 根据文章ID获取评论
func GetCommentsByArticleID(c *gin.Context) {
	idStr := c.Param("id")
	articleId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的文章ID")
		return
	}

	comments, err := service.GetCommentsByArticleID(uint(articleId))
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "获取评论失败: "+err.Error())
		return
	}

	// 返回完整的评论对象数组，与前端类型定义一致
	utils.Success(c, comments, "")
}
