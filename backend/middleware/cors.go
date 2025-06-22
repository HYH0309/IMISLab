package middleware

import (
	"fmt"
	"github.com/fatih/color"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupCORS 设置跨域中间件
func SetupCORS() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"www.hyh0209.cn"}, // 在生产环境中应该指定具体的域名
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// Logger 自定义日志中间件
func Logger() gin.HandlerFunc {
	// 创建颜色函数
	green := color.New(color.FgGreen).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()
	red := color.New(color.FgRed).SprintFunc()
	cyan := color.New(color.FgCyan).SprintFunc()
	magenta := color.New(color.FgMagenta).SprintFunc()

	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		// 根据状态码选择颜色
		var statusColor func(a ...interface{}) string
		switch {
		case param.StatusCode >= 200 && param.StatusCode < 300:
			statusColor = green
		case param.StatusCode >= 300 && param.StatusCode < 400:
			statusColor = cyan
		case param.StatusCode >= 400 && param.StatusCode < 500:
			statusColor = yellow
		default:
			statusColor = red
		}

		// 根据方法选择颜色
		var methodColor func(a ...interface{}) string
		switch param.Method {
		case "GET":
			methodColor = cyan
		case "POST":
			methodColor = green
		case "PUT", "PATCH":
			methodColor = yellow
		case "DELETE":
			methodColor = red
		default:
			methodColor = magenta
		}

		// 简化时间格式
		timestamp := param.TimeStamp.Format("2006/01/02 15:04:05")

		// 格式化延迟
		latency := param.Latency
		latencyStr := fmt.Sprintf("%.3fms", float64(latency.Microseconds())/1000)

		// 格式化错误信息
		errorMsg := ""
		if param.ErrorMessage != "" {
			errorMsg = red(" | Error: " + param.ErrorMessage)
		}

		// 简化用户代理
		userAgent := param.Request.UserAgent()
		if len(userAgent) > 50 {
			userAgent = userAgent[:47] + "..."
		}

		// 格式化路径
		path := param.Path
		if param.Request.URL.RawQuery != "" {
			path += "?" + param.Request.URL.RawQuery
		}

		// 响应大小格式化
		if param.BodySize > 0 {
			if param.BodySize < 1024 {

			} else {

			}
		}

		return fmt.Sprintf(
			"%s %s %s %s | %s | %s | %s | %s%s\n",
			yellow("[GIN]"),
			timestamp,
			statusColor(fmt.Sprintf("%3d", param.StatusCode)),
			methodColor(fmt.Sprintf("%-7s", param.Method)),
			cyan(path),
			latencyStr,
			magenta(param.ClientIP),
			magenta(userAgent),
			errorMsg,
		)
	})
}
