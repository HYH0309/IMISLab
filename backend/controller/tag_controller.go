package controller

import (
	"backend/dto"
	"backend/service"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateTag 创建标签
func CreateTag(c *gin.Context) {
	var req dto.TagCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	_, err := service.CreateTag(req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, nil, "标签创建成功")
}

// GetAllTags 获取所有标签
func GetAllTags(c *gin.Context) {
	tags, err := service.GetAllTags()
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, tags, "获取标签列表成功")
}

// UpdateTag 更新标签
func UpdateTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的标签ID")
		return
	}

	var req dto.TagUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	_, err = service.UpdateTag(uint(id), req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, nil, "标签更新成功")
}

// DeleteTag 删除标签
func DeleteTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的标签ID")
		return
	}

	err = service.DeleteTag(uint(id))
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, nil, "标签删除成功")
}
