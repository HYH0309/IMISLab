# IMISLab博客与在线评测系统开发提示

## 项目概述

开发一个基于Go语言和Gin框架的后端API，包含博客系统、图片管理和在线评测系统(OJ)。项目命名为"backend"，采用清晰的分层架构。

## 技术栈

- Go 1.16+
- Gin Web框架
- GORM + MySQL
- 文件系统图片存储

## 项目架构

使用标准的分层架构：

- Controller处理HTTP请求
- Service实现业务逻辑
- DTO用于数据传输
- Entity映射数据库
- 接口与实现分离，实现放在impl包中

## 功能模块

### 1. 博客系统

#### 文章管理 API

```go
// 路由设置
func SetupArticleRouter(r *gin.Engine, articleController *controller.ArticleController) {
    ArticleRouter := r.Group("/articles")
    {
        ArticleRouter.POST("", articleController.CreateArticle)
        ArticleRouter.GET("", articleController.GetArticleSummaries)
        ArticleRouter.GET("/:id", articleController.GetArticleByID)
        ArticleRouter.PUT("/:id", articleController.UpdateArticle)
        ArticleRouter.DELETE("/:id", articleController.DeleteArticle)
    }
}
```

#### 评论系统 API

```go
func SetupCommentRouter(r *gin.Engine, commentController *controller.CommentController) {
    CommentRouter := r.Group("/comments")
    {
        CommentRouter.GET("/:id", commentController.GetCommentsByArticleID)
        CommentRouter.POST("", commentController.CreateComment)
    }
}
```

#### 标签系统 API

```go
func SetupTagRouter(r *gin.Engine, tagController *controller.TagController) {
    tagRouter := r.Group("/tags")
    {
        tagRouter.POST("", tagController.CreateTag)
        tagRouter.GET("", tagController.GetTags)
        tagRouter.PUT("/:id", tagController.UpdateTag)
        tagRouter.DELETE("/:id", tagController.DeleteTag)
    }
}
```

### 2. 图片管理系统

#### 图片静态托管服务

```go
// 路由设置 - 同时支持API和静态文件服务
func SetupImgRouter(r *gin.Engine, imgController *controller.ImgController) {
    // API路由组
    ImgRouter := r.Group("/api/images")
    {
        ImgRouter.POST("", imgController.UploadImage)         // 上传图片
        ImgRouter.DELETE("/:filename", imgController.DeleteImage) // 删除图片
        ImgRouter.GET("", imgController.GetAllImages)         // 获取所有图片列表
        ImgRouter.GET("/info/:filename", imgController.GetImageInfo) // 获取图片信息
    }
    
    // 静态文件服务 - 前端可直接访问
    r.Static("/images", "./images") // 将/images路径映射到./images目录
}

// ImgService 图片服务接口
type ImgService interface {
    // UploadImage 上传图片
    UploadImage(file *multipart.FileHeader) (result entity.Result)
    // DeleteImage 删除图片
    DeleteImage(filename string) (result entity.Result)
    // GetAllImages 获取所有图片列表
    GetAllImages() (result entity.Result)
    // GetImageInfo 获取图片信息
    GetImageInfo(filename string) (imageDTO dto.ImageDTO, result entity.Result)
}
```

### 3. 在线评测系统(OJ)

#### OJ问题管理 API

```go
func SetupOJRouter(r *gin.Engine, OJController *controller.OJController) {
    OJRouter := r.Group("/oj")
    {
        OJRouter.GET("/problems", OJController.GetOJProblems)
        OJRouter.POST("/problem", OJController.CreateOJProblem)
        OJRouter.DELETE("problem/:problem_id", OJController.DeleteProblem)
        OJRouter.POST("/testcase/:problem_id", OJController.CreateTestCases)
    }
}
```

#### 代码评测 API

```go
func SetupOnlineJudgeRouter(r *gin.Engine, onlineJudgeController *controller.OnlineJudgeController) {
    OnlineJudgeRouter := r.Group("/judge")
    {
        OnlineJudgeRouter.POST("/submit", onlineJudgeController.SubmitCode)
        OnlineJudgeRouter.GET("/status/:token", onlineJudgeController.GetJudgeStatus)
    }
}
```

## 数据库配置

### MySQL配置示例

```go
// config/db.go
package config

import (
    "fmt"
    "os"
    
    "github.com/joho/godotenv"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
    // 加载环境变量
    if err := godotenv.Load(); err != nil {
        fmt.Println("未找到.env文件，使用环境变量")
    }
    
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        getEnv("DB_USER", "root"),
        getEnv("DB_PASSWORD", "password"),
        getEnv("DB_HOST", "localhost"),
        getEnv("DB_PORT", "3306"),
        getEnv("DB_NAME", "imislab"))
    
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("数据库连接失败: " + err.Error())
    }
    
    // 自动迁移
    db.AutoMigrate(
        &entity.Article{},
        &entity.Tag{},
        &entity.Comments{},
        &entity.OJProblem{},
        &entity.OJTestcase{},
        &entity.Submission{},
    )
    
    DB = db
}

// 从环境变量中获取配置，如果不存在则使用默认值
func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}
```

## 优化方向

1. **实体类精简**：
   - 实体类只保留必要字段，例如Tag只需要id和name
   - 使用关联ID而非嵌套对象，避免循环引用
   - 尽量减少冗余字段，保持最小可行性

2. **统一包引用**：所有包引用使用`backend`而非`Blog-gin`

3. **实体与DTO分离**：
   - 创建专用的DTO结构体用于API响应
   - 避免直接暴露数据库实体到外部
   - 实现简单的转换逻辑

4. **接口实现分离**：
   - 所有Service接口的实现放在impl包中
   - 使用依赖注入方式创建服务实例

5. **图片服务静态代理**：
   - 直接使用文件系统存储图片
   - 提供简单的静态文件服务
   - 实现基本的文件类型检查

6. **标准化错误处理**：使用统一的错误响应格式

7. **文档与测试**：增加API文档和单元测试

## 实现示例

### 精简的实体定义示例

```go
// entity/Tag.go
package entity

import "gorm.io/gorm"

// Tag 标签实体 - 保持简洁，只有必要字段
type Tag struct {
    gorm.Model
    Name string `gorm:"size:50;uniqueIndex" json:"name"`
}
```

### DTO定义示例

```go
// dto/ArticleDTO.go
package dto

import (
    "time"
)

// ArticleDTO 文章数据传输对象
type ArticleDTO struct {
    ID        uint      `json:"id"`
    Title     string    `json:"title"`
    Summary   string    `json:"summary,omitempty"`
    Content   string    `json:"content,omitempty"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    Tags      []uint    `json:"tag_ids,omitempty"` // 只使用ID，不嵌套对象
}
```

### 服务接口与实现示例

```go
// service/TagService.go
package service

import (
    "backend/entity"
)

// TagService 标签服务接口 - 定义最小功能集
type TagService interface {
    CreateTag(tag *entity.Tag) (result entity.Result)
    GetTags() (result entity.Result)
    UpdateTag(id uint, tag *entity.Tag) (result entity.Result)
    DeleteTag(id uint) (result entity.Result)
}

// service/impl/TagServiceImpl.go
package impl

import (
    "backend/entity"
    "backend/service"
    "gorm.io/gorm"
)

// TagServiceImpl 标签服务实现
type TagServiceImpl struct {
    DB *gorm.DB
}

// NewTagService 创建标签服务实例
func NewTagService(db *gorm.DB) service.TagService {
    return &TagServiceImpl{DB: db}
}

// CreateTag 创建标签实现
func (s *TagServiceImpl) CreateTag(tag *entity.Tag) entity.Result {
    if tag.Name == "" {
        return entity.Error("标签名不能为空")
    }
    
    // 检查是否已存在
    var count int64
    s.DB.Model(&entity.Tag{}).Where("name = ?", tag.Name).Count(&count)
    if count > 0 {
        return entity.Error("标签已存在")
    }
    
    if err := s.DB.Create(tag).Error; err != nil {
        return entity.Error("创建标签失败: " + err.Error())
    }
    
    return entity.SuccessWithData(tag)
}
```

### 控制器示例

```go
// controller/TagController.go
package controller

import (
    "backend/entity"
    "backend/service"
    "backend/utils"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

// TagController 标签控制器
type TagController struct {
    tagService service.TagService
}

// NewTagController 创建标签控制器实例
func NewTagController(service service.TagService) *TagController {
    return &TagController{tagService: service}
}

// CreateTag 创建标签
func (tc *TagController) CreateTag(c *gin.Context) {
    var tag entity.Tag
    if err := c.ShouldBindJSON(&tag); err != nil {
        c.JSON(http.StatusBadRequest, entity.Error("无效的标签数据"))
        return
    }

    result := tc.tagService.CreateTag(&tag)
    c.JSON(utils.ResultStatusMapper(result), result)
}
```

### OnlineJudge实现 (远程Judge0集成)

```go
// service/OnlineJudge.go
package service

import (
    "backend/entity"
)

// OnlineJudgeService 在线判题服务接口
type OnlineJudgeService interface {
    // Judge 评测代码
    Judge(submission *entity.Submission) (result entity.Result)
    // GetJudgeStatus 获取评测状态
    GetJudgeStatus(token string) (result entity.Result)
}

// 实现部分
package service

import (
    "backend/entity"
    "backend/config"
    "bytes"
    "encoding/json"
    "errors"
    "net/http"
    "time"
)

// OnlineJudgeService 在线判题服务实现
type OnlineJudgeService struct {
    TargetURL string       // Judge0 API端点
    Client    *http.Client // HTTP客户端
    db        *gorm.DB     // 数据库连接
}

// NewOnlineJudgeService 创建在线判题服务实例
func NewOnlineJudgeService() *OnlineJudgeService {
    return &OnlineJudgeService{
        TargetURL: "http://47.92.90.228:2358/submissions", // Judge0 API地址
        Client:    &http.Client{},
        db:        config.DB,
    }
}

// Judge 提交代码到Judge0进行评测
func (s *OnlineJudgeService) Judge(submission *entity.Submission) entity.Result {
    // 1. 从数据库获取问题及其测试用例
    var problem entity.OJProblem
    if err := s.db.First(&problem, submission.ProblemID).Error; err != nil {
        return entity.Error("找不到对应的问题")
    }
    
    var testcases []entity.OJTestcase
    if err := s.db.Where("problem_id = ?", problem.ID).Find(&testcases).Error; err != nil {
        return entity.Error("获取测试用例失败")
    }
    
    if len(testcases) == 0 {
        return entity.Error("该问题没有测试用例")
    }
    
    // 2. 提交到Judge0
    token, err := s.SubmitToJudge0(submission.Code, submission.Language, testcases)
    if err != nil {
        return entity.Error("提交评测失败: " + err.Error())
    }
    
    // 3. 保存提交记录
    submission.Status = "等待中"
    submission.Token = token
    if err := s.db.Create(submission).Error; err != nil {
        return entity.Error("保存提交记录失败")
    }
    
    return entity.SuccessWithData(map[string]interface{}{
        "submission_id": submission.ID,
        "token": token,
    })
}

// 语言ID映射
var languageMap = map[string]int{
    "cpp":    54,  // C++ (GCC 9.2.0)
    "java":   62,  // Java (OpenJDK 13.0.1)
    "python": 71,  // Python (3.8.1)
}
```

## 注意事项

1. **最小可行性**：实体类保持简单，只包含必要字段
2. **统一结果格式**：所有接口返回entity.Result格式
3. **静态图片托管**：图片直接通过URL访问，不需要API中转
4. **包命名统一**：使用"backend"代替"Blog-gin"
5. **分层架构**：严格遵循Controller -> Service -> Repository模式
6. **错误处理**：标准化错误响应，便于前端处理
7. **远程Judge0**：使用远程Judge0服务进行代码评测，而非本地执行

## 图片服务实现示例

```go
// 配置静态文件服务 (main.go)
func main() {
    // ...
    r := gin.Default()

    // 静态文件服务配置
    r.Static("/images", "./images") // 前端可以通过 /images/filename.jpg 直接访问图片
    
    // 其他路由设置
    // ...
}

// 图片服务实现 (service/impl/ImgServiceImpl.go)
package impl

import (
    "backend/dto"
    "backend/entity"
    "backend/service"
    "fmt"
    "io"
    "mime/multipart"
    "os"
    "path/filepath"
    "strings"
    "time"
)

// ImgServiceImpl 图片服务实现
type ImgServiceImpl struct {
    ImageFolder string  // 图片存储目录
    BaseURL     string  // 图片访问基础URL
}

// NewImgService 创建图片服务实例
func NewImgService() service.ImgService {
    return &ImgServiceImpl{
        ImageFolder: "./images",
        BaseURL:     "/images", // 与静态文件路由一致
    }
}

// UploadImage 上传图片
func (s *ImgServiceImpl) UploadImage(file *multipart.FileHeader) entity.Result {
    // 确保图片文件夹存在
    if err := os.MkdirAll(s.ImageFolder, 0755); err != nil {
        return entity.Error(fmt.Sprintf("创建图片目录失败: %s", err.Error()))
    }

    // 生成唯一文件名
    ext := filepath.Ext(file.Filename)
    timestamp := time.Now().Format("20060102150405")
    newFilename := timestamp + ext
    
    // 完整的文件路径
    dst := filepath.Join(s.ImageFolder, newFilename)
    
    // 保存上传的文件
    src, err := file.Open()
    if err != nil {
        return entity.Error(fmt.Sprintf("打开上传文件失败: %s", err.Error()))
    }
    defer src.Close()
    
    out, err := os.Create(dst)
    if err != nil {
        return entity.Error(fmt.Sprintf("创建目标文件失败: %s", err.Error()))
    }
    defer out.Close()
    
    _, err = io.Copy(out, src)
    if err != nil {
        return entity.Error(fmt.Sprintf("保存文件失败: %s", err.Error()))
    }
    
    // 返回可直接访问的URL
    return entity.SuccessWithData(map[string]string{
        "filename": newFilename,
        "url":      fmt.Sprintf("%s/%s", s.BaseURL, newFilename), // 直接返回可访问的URL
    })
}
```

使用这种方式，当图片上传成功后，前端将获得类似以下的响应：

```json
{
  "status": true,
  "message": "上传成功",
  "data": {
    "filename": "20250615120530.jpg",
    "url": "/images/20250615120530.jpg"
  }
}
```

前端可以直接使用这个URL来显示图片，例如：

```html
<img src="/images/20250615120530.jpg" alt="上传的图片" />
```

这种静态托管方式简化了图片访问流程，不需要通过API接口来获取图片数据，提高了性能和用户体验。
