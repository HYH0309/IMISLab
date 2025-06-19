package utils

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Status bool        `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data,omitempty"`
}

// Success 成功响应
func Success(c *gin.Context, data interface{}, msg string) {
	if msg == "" {
		msg = "操作成功"
	}
	c.JSON(http.StatusOK, Response{
		Status: true,
		Msg:    msg,
		Data:   data,
	})
}

// Fail 失败响应
func Fail(c *gin.Context, statusCode int, msg string) {
	if statusCode == 0 {
		statusCode = http.StatusInternalServerError
	}
	if msg == "" {
		msg = "操作失败"
	}
	c.JSON(statusCode, Response{
		Status: false,
		Msg:    msg,
	})
}

// FailWithData 失败响应，带数据
func FailWithData(c *gin.Context, statusCode int, msg string, data interface{}) {
	if statusCode == 0 {
		statusCode = http.StatusInternalServerError
	}
	if msg == "" {
		msg = "操作失败"
	}
	c.JSON(statusCode, Response{
		Status: false,
		Msg:    msg,
		Data:   data,
	})
}

// LogError 记录错误日志
func LogError(message string, err error) {
	if err != nil {
		log.Printf("[ERROR] %s: %v", message, err)
	}
}

// ToJSONString 将对象转换为JSON字符串
func ToJSONString(obj interface{}) string {
	bytes, err := json.Marshal(obj)
	if err != nil {
		LogError("JSON序列化失败", err)
		return ""
	}
	return string(bytes)
}

// ParseJSONString 将JSON字符串解析为对象
func ParseJSONString(jsonStr string, obj interface{}) error {
	return json.Unmarshal([]byte(jsonStr), obj)
}
