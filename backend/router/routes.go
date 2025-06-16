package router

import (
	"backend/controller"

	"github.com/gin-gonic/gin"
)

// SetupRoutes 设置所有路由
func SetupRoutes(r *gin.Engine) {
	// 静态文件服务 - 图片访问
	r.Static("/images", "./uploads/images")
	// 图片上传接口 (前端使用 /img)
	r.POST("/img", controller.UploadImage)

	// API路由组
	api := r.Group("/api")
	{
		// 图片管理接口
		images := api.Group("/images")
		{
			images.POST("", controller.UploadImage)
			images.DELETE("/:filename", controller.DeleteImage)
			images.GET("", controller.GetAllImages)
			images.GET("/info/:filename", controller.GetImageInfo)
		}
	}

	// 文章相关路由
	articles := r.Group("/articles")
	{
		articles.POST("", controller.CreateArticle)
		articles.GET("", controller.GetArticles)
		articles.GET("/:id", controller.GetArticleByID)
		articles.PUT("/:id", controller.UpdateArticle)
		articles.DELETE("/:id", controller.DeleteArticle)
	}

	// 评论相关路由
	comments := r.Group("/comments")
	{
		comments.GET("/:id", controller.GetCommentsByArticleID)
		comments.POST("", controller.CreateComment)
	}

	// 标签相关路由
	tags := r.Group("/tags")
	{
		tags.POST("", controller.CreateTag)
		tags.GET("", controller.GetAllTags)
		tags.PUT("/:id", controller.UpdateTag)
		tags.DELETE("/:id", controller.DeleteTag)
	}
	// OJ相关路由
	oj := r.Group("/oj")
	{
		oj.GET("/problems", controller.GetAllProblems)
		oj.GET("/problems/:id", controller.GetProblemByID) // 新增：根据ID获取题目
		oj.POST("/problem", controller.CreateProblem)
		oj.PUT("/problem/:id", controller.UpdateProblem)   // 新增：更新题目
		oj.DELETE("/problem/:id", controller.DeleteProblem)
		oj.POST("/testcase/:problem_id", controller.CreateTestcase)
		oj.GET("/testcase/:problem_id", controller.GetTestcases) // 新增：获取测试用例
		oj.POST("/judge", controller.SubmitCode)                 // 前端使用 /oj/judge
		oj.GET("/judge", controller.GetJudgeResult)              // 前端使用 /oj/judge?token=xxx
	}
}
