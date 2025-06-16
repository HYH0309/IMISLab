package controller

import (
	"backend/utils"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadImage 上传图片
func UploadImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("file") // 注意：前端使用 'file' 作为字段名
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "没有上传文件")
		return
	}
	defer file.Close()

	// 验证文件类型
	allowedTypes := []string{".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}
	ext := strings.ToLower(filepath.Ext(header.Filename))
	isAllowed := false
	for _, allowedType := range allowedTypes {
		if ext == allowedType {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		utils.Fail(c, http.StatusBadRequest, "无效的文件类型，仅允许图片文件")
		return
	}

	// 生成唯一文件名
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, header.Filename)

	// 确保上传目录存在
	uploadDir := "uploads/images"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		utils.Fail(c, http.StatusInternalServerError, "创建上传目录失败")
		return
	}
	// 保存文件
	filePath := filepath.Join(uploadDir, filename)
	dst, err := os.Create(filePath)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "创建文件失败")
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		utils.Fail(c, http.StatusInternalServerError, "保存文件失败")
		return
	}

	// 返回文件访问URL（与前端接口对应，只返回URL字符串）
	fileUrl := fmt.Sprintf("/images/%s", filename)
	utils.Success(c, fileUrl, "图片上传成功")
}

// DeleteImage 删除图片
func DeleteImage(c *gin.Context) {
	filename := c.Param("filename")
	if filename == "" {
		utils.Fail(c, http.StatusBadRequest, "文件名是必需的")
		return
	}

	filePath := filepath.Join("uploads/images", filename)

	// 检查文件是否存在
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		utils.Fail(c, http.StatusNotFound, "文件不存在")
		return
	}

	// 删除文件
	if err := os.Remove(filePath); err != nil {
		utils.Fail(c, http.StatusInternalServerError, "删除文件失败")
		return
	}

	utils.Success(c, nil, "图片删除成功")
}

// GetAllImages 获取所有图片列表
// GetAllImages 获取所有图片列表
func GetAllImages(c *gin.Context) {
	files, err := os.ReadDir("uploads/images")
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "读取目录失败")
		return
	}

	var images []gin.H
	for _, file := range files {
		if !file.IsDir() {
			fileInfo, err := file.Info()
			if err != nil {
				continue
			}

			images = append(images, gin.H{
				"filename":   file.Name(),
				"url":        fmt.Sprintf("/images/%s", file.Name()),
				"size":       fileInfo.Size(),
				"modifiedAt": fileInfo.ModTime().Format("2006-01-02 15:04:05"),
			})
		}
	}

	utils.Success(c, images, "")
}

// GetImageInfo 获取图片信息
func GetImageInfo(c *gin.Context) {
	filename := c.Param("filename")
	if filename == "" {
		utils.Fail(c, http.StatusBadRequest, "文件名是必需的")
		return
	}

	filePath := filepath.Join("uploads/images", filename)

	fileInfo, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		utils.Fail(c, http.StatusNotFound, "文件不存在")
		return
	}
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "获取文件信息失败")
		return
	}
	imageInfo := gin.H{
		"filename":   fileInfo.Name(),
		"url":        fmt.Sprintf("/images/%s", filename),
		"size":       fileInfo.Size(),
		"type":       filepath.Ext(filename),
		"modifiedAt": fileInfo.ModTime().Format("2006-01-02 15:04:05"),
	}

	utils.Success(c, imageInfo, "")
}
