# IMISLab博客与在线评测系统开发需求

## 1. 项目概述

"IMISLab"是一个集博客、评论、标签、图片管理和在线评测系统(OJ)于一体的综合平台。该项目旨在提供一个完整的知识分享和编程练习平台，使用Go语言和Gin框架开发后端API。

## 2. 系统架构

项目采用分层架构设计：

- **Controller层**：处理HTTP请求，调用Service层
- **Service层**：业务逻辑处理
- **DTO层**：数据传输对象
- **Entity层**：数据库实体映射
- **Router层**：路由定义
- **Config层**：配置管理
- **Middleware层**：中间件
- **Utils层**：工具函数

## 3. 功能模块

### 3.1 博客系统

- **文章管理**
  - 创建文章 (仅包含必要字段：标题、内容、标签)
  - 获取文章摘要列表 (分页支持)
  - 获取文章详情
  - 更新文章
  - 删除文章

- **评论系统**
  - 根据文章ID获取评论
  - 创建评论 (仅需要内容和作者)

- **标签系统**
  - 创建标签 (仅需要名称)
  - 获取所有标签
  - 更新标签
  - 删除标签

### 3.2 图片管理系统

- 上传图片 (静态代理模式)
- 删除图片
- 获取图片
- 获取所有图片列表
- 获取图片信息 (文件名、类型、大小)

### 3.3 在线评测系统(OJ)

- **问题管理**
  - 获取所有问题 (简化问题描述)
  - 创建问题 (仅包含标题、描述、难度和限制)
  - 删除问题
  - 为问题创建测试用例

- **代码评测**
  - 提交代码
  - 评测代码 (支持多种语言)

## 4. API接口设计

### 4.1 博客系统

#### 文章接口

- `POST /articles`：创建文章
- `GET /articles`：获取文章摘要列表
- `GET /articles/:id`：获取文章详情
- `PUT /articles/:id`：更新文章
- `DELETE /articles/:id`：删除文章

#### 评论接口

- `GET /comments/:id`：根据文章ID获取评论
- `POST /comments`：创建评论

#### 标签接口

- `POST /tags`：创建标签
- `GET /tags`：获取所有标签
- `PUT /tags/:id`：更新标签
- `DELETE /tags/:id`：删除标签

### 4.2 图片管理系统接口

- `POST /api/images`：上传图片
- `DELETE /api/images/:filename`：删除图片
- `GET /api/images`：获取所有图片列表
- `GET /api/images/info/:filename`：获取图片信息
- `GET /images/:filename`：直接访问图片文件（静态托管）

### 4.3 在线评测系统接口

- `GET /oj/problems`：获取所有问题
- `POST /oj/problem`：创建问题
- `DELETE /oj/problem/:problem_id`：删除问题
- `POST /oj/testcase/:problem_id`：为问题创建测试用例
- `POST /judge/submit`：提交代码进行评测
- `GET /judge/status/:token`：获取评测状态

## 5. 数据模型

### 5.1 文章(Article)

- ID：唯一标识符
- 标题：文章标题 (必需)
- 内容：文章内容 (必需)
- 摘要：文章摘要 (自动生成或可选)
- 封面图片URL：文章封面图片链接 (可选)
- 创建时间：文章创建时间
- 更新时间：文章更新时间
- 标签IDs：关联的标签ID列表

### 5.2 评论(Comment)

- ID：唯一标识符
- 文章ID：关联的文章
- 内容：评论内容 (必需)
- 作者：评论作者 (必需)
- 创建时间：评论创建时间

### 5.3 标签(Tag)

- ID：唯一标识符
- 名称：标签名称 (必需，唯一)

### 5.4 OJ问题(OJProblem)

- ID：唯一标识符
- 标题：问题标题 (必需)
- 描述：问题描述 (必需)
- 难度：问题难度 (简单/中等/困难)
- 时间限制：执行时间限制 (默认1000ms)
- 内存限制：内存使用限制 (默认256MB)

### 5.5 OJ测试用例(OJTestcase)

- ID：唯一标识符
- 问题ID：关联的问题
- 输入：测试输入
- 输出：期望输出

### 5.6 提交记录(Submission)

- ID：唯一标识符
- 问题ID：关联的问题
- 代码：提交的代码
- 语言：编程语言 (支持Go/C++/Java/Python)
- 状态：评测状态 (等待中/运行中/通过/失败)
- 执行时间：代码执行时间 (ms)
- 内存使用：代码内存使用 (KB)
- 提交时间：代码提交时间
- 评测令牌：Judge0返回的评测令牌

## 6. 技术栈

- **后端框架**：Gin
- **数据库**：GORM (MySQL)
- **编程语言**：Go

## 7. 数据库配置

### 7.1 MySQL配置

```go
// config/db.go
func InitDB() *gorm.DB {
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_PORT"),
        os.Getenv("DB_NAME"))
    
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }
    
    // 自动迁移数据库表结构
    db.AutoMigrate(
        &entity.Article{},
        &entity.Tag{},
        &entity.Comments{},
        &entity.OJProblem{},
        &entity.OJTestcase{},
        &entity.Submission{},
    )
    
    return db
}
```

### 7.2 环境变量配置

```env
# .env 文件示例
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=imislab
SERVER_PORT=3344
```

## 8. OnlineOJ配置

### 8.1 远程代码执行引擎

OnlineOJ使用Judge0作为远程代码执行引擎，通过HTTP API与远程沙箱通信：

```go
// service/OnlineJudge.go
type OnlineJudgeService struct {
    TargetURL string         // Judge0 API端点
    Client    *http.Client   // HTTP客户端
    db        *gorm.DB       // 数据库连接
}

// 创建在线判题服务实例
func NewOnlineJudgeService() *OnlineJudgeService {
    return &OnlineJudgeService{
        TargetURL: "http://47.92.90.228:2358/submissions", // Judge0 API地址
        Client:    &http.Client{},
        db:        config.DB,
    }
}

// 判题接口
type OnlineJudgeService interface {
    Judge(submission *entity.Submission) (result entity.Result)
    GetJudgeStatus(token string) (result entity.Result)
}

// 支持的语言和编译/执行命令
var languageConfigs = map[string]LanguageConfig{
    "go": {
        Extension:      ".go",
        CompileCommand: "go build -o {executable} {sourceFile}",
        RunCommand:     "./{executable}",
        Timeout:        5, // 秒
    },
    "cpp": {
        Extension:      ".cpp",
        CompileCommand: "g++ -std=c++11 -o {executable} {sourceFile}",
        RunCommand:     "./{executable}",
        Timeout:        2,
    },
    "java": {
        Extension:      ".java",
        CompileCommand: "javac {sourceFile}",
        RunCommand:     "java {className}",
        Timeout:        5,
    },
    "python": {
        Extension:      ".py",
        CompileCommand: "", // 解释型语言不需要编译
        RunCommand:     "python {sourceFile}",
        Timeout:        5,
    },
}
```

### 8.2 Judge0 API集成

Judge0是一个开源的代码执行系统，提供安全的代码执行环境。集成方式如下：

```go
// 提交代码到Judge0
func (s *OnlineJudgeService) SubmitToJudge0(code, language string, testcases []entity.OJTestcase) (string, error) {
    // 构建请求体
    requestBody := map[string]interface{}{
        "source_code": code,
        "language_id": getLanguageID(language), // 转换为Judge0语言ID
        "stdin":       testcases[0].Input,      // 使用第一个测试用例作为标准输入
        "expected_output": testcases[0].Output, // 期望输出
    }
    
    jsonData, err := json.Marshal(requestBody)
    if err != nil {
        return "", err
    }
    
    // 发送请求到Judge0
    req, err := http.NewRequest("POST", s.TargetURL, bytes.NewBuffer(jsonData))
    if err != nil {
        return "", err
    }
    
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := s.Client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    
    // 解析响应
    var result map[string]interface{}
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", err
    }
    
    // 获取评测令牌
    token, ok := result["token"].(string)
    if !ok {
        return "", errors.New("无法获取评测令牌")
    }
    
    return token, nil
}

// Judge0支持的语言ID映射
func getLanguageID(language string) int {
    languageMap := map[string]int{
        "go":     60,  // Go (1.13.5)
        "cpp":    54,  // C++ (GCC 9.2.0)
        "java":   62,  // Java (OpenJDK 13.0.1)
        "python": 71,  // Python (3.8.1)
    }
    
    id, ok := languageMap[language]
    if !ok {
        return 71 // 默认使用Python
    }
    
    return id
}
```

## 9. 项目结构优化建议

1. **精简实体类**：
   - 实体类只保留必要字段，减少数据冗余
   - 使用关联ID代替嵌套对象，按需加载关联数据
   - 移除冗余的描述性字段

2. **统一包引用**：将所有`Blog-gin`引用修改为`backend`

3. **接口与实现分离**：
   - 所有服务定义接口放在service包中
   - 实现类放在service/impl包中
   - 使用依赖注入方式创建服务实例

4. **DTO与实体分离**：
   - 对外提供的数据使用DTO而非直接使用实体
   - DTO类型定义在dto包中
   - 实现实体到DTO的转换逻辑

5. **图片服务优化**：
   - 使用静态文件托管方式实现图片服务
   - 前端可以直接通过URL访问图片文件
   - 后端只负责图片的上传、删除和元数据管理
   - 文件操作使用标准库处理，不保存到数据库
   - 提供基本的文件类型验证和大小限制

6. **错误处理统一**：
   - 统一处理HTTP状态码和错误响应格式
   - 定义通用的错误类型和处理机制

7. **文档与测试**：
   - 添加API文档支持（例如Swagger）
   - 为关键业务逻辑添加单元测试

## 10. 部署要求

- Go 1.16+
- MySQL 5.7+
- 配置文件支持开发和生产环境分离
- 容器化部署支持

## 11. DTO示例

以下是基于最小可行性原则的DTO设计示例：

### 提交代码DTO

```go
// dto/SubmissionDTO.go
package dto

// SubmissionRequestDTO 提交代码请求
type SubmissionRequestDTO struct {
    ProblemID uint   `json:"problem_id" binding:"required"`
    Code      string `json:"code" binding:"required"`
    Language  string `json:"language" binding:"required,oneof=go cpp java python"`
}

// SubmissionResponseDTO 提交代码响应
type SubmissionResponseDTO struct {
    SubmissionID uint   `json:"submission_id"`
    Token        string `json:"token"`
}
```

### 评测状态DTO

```go
// dto/JudgeStatusDTO.go
package dto

import "time"

// JudgeStatusDTO 评测状态响应
type JudgeStatusDTO struct {
    Status      string    `json:"status"`
    Message     string    `json:"message,omitempty"`
    ExecutionTime int     `json:"execution_time,omitempty"` // 毫秒
    Memory      int       `json:"memory,omitempty"`         // KB
    SubmittedAt time.Time `json:"submitted_at"`
    CompletedAt time.Time `json:"completed_at,omitempty"`
}
```

### 问题DTO

```go
// dto/ProblemDTO.go
package dto

// ProblemSummaryDTO 问题摘要DTO
type ProblemSummaryDTO struct {
    ID          uint   `json:"id"`
    Title       string `json:"title"`
    Difficulty  string `json:"difficulty"`
    TimeLimit   int    `json:"time_limit"`
    MemoryLimit int    `json:"memory_limit"`
}

// ProblemDetailDTO 问题详情DTO
type ProblemDetailDTO struct {
    ProblemSummaryDTO
    Description string `json:"description"`
}
```

这些DTO示例遵循了最小可行性原则，只包含必要的字段，同时分离了请求DTO和响应DTO，使API接口更加清晰和可维护。
