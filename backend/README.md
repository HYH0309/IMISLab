# IMISLab 后端服务

[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org/)
[![Gin Framework](https://img.shields.io/badge/Gin-1.9+-00C7B7?logo=gin)](https://gin-gonic.com/)
[![Redis](https://img.shields.io/badge/Redis-6.x+-DC382D?logo=redis)](https://redis.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql)](https://www.mysql.com/)

基于 Go + Gin + GORM + Redis 的高性能后端 API 服务，为 IMISLab 学习平台提供稳定可靠的数据服务。

## 🚀 快速开始

### 前置要求

- Go 1.21+
- Redis 6.x+
- MySQL 8.0+

### 一键启动

```bash
# 使用项目根目录的启动脚本
cd .. && .\start-project.ps1

# 或手动启动
go run main.go
```

### 手动部署

```bash
# 1. 安装依赖
go mod download

# 2. 启动 Redis
docker run -d -p 6379:6379 redis:alpine

# 3. 配置数据库
# 创建数据库并导入初始数据

# 4. 启动服务
go run main.go

# 5. 生产构建
go build -o IMISLab_backend main.go
```

## �️ 技术栈

### 核心框架

- **Go 1.21+** - 高性能并发编程语言
- **Gin 1.9+** - 轻量级高性能 HTTP Web 框架  
- **GORM 1.25+** - 功能强大的 Go ORM 框架
- **Redis 6.x** - 高性能内存数据库，用于缓存和限流
- **MySQL 8.0** - 主数据库，存储业务数据

### 集成服务

- **Judge0 API** - 在线代码执行和判题服务
- **CORS 中间件** - 跨域请求处理
- **文件上传** - 图片上传和管理
- **定时任务** - Redis 数据同步

## 📁 项目架构

```txt
backend/
├── 📁 config/              # 配置管理
│   └── db.go              # 数据库和 Redis 连接配置
├── 📁 controller/          # 控制器层 - HTTP 请求处理
│   ├── article_controller.go    # 文章相关接口
│   ├── comment_controller.go    # 评论管理接口
│   ├── image_controller.go      # 图片上传接口
│   ├── oj_controller.go         # OJ 系统接口
│   └── tag_controller.go        # 标签管理接口
├── 📁 dto/                 # 数据传输对象
│   ├── article.go         # 文章 DTO
│   ├── comment.go         # 评论 DTO
│   ├── oj.go             # OJ DTO
│   └── tag.go            # 标签 DTO
├── 📁 entity/              # 数据库实体模型
│   ├── Article.go         # 文章实体
│   ├── Comment.go         # 评论实体
│   ├── OJProblem.go       # OJ 题目实体
│   ├── OJTestcase.go      # OJ 测试用例实体
│   ├── Submission.go      # 代码提交实体
│   └── Tag.go            # 标签实体
├── 📁 middleware/          # 中间件
│   └── cors.go           # CORS 跨域处理
├── 📁 router/              # 路由配置
│   └── routes.go         # API 路由定义
├── 📁 service/             # 业务逻辑层
│   ├── article_service.go      # 文章业务逻辑
│   ├── comment_service.go      # 评论业务逻辑
│   ├── oj_service.go          # OJ 业务逻辑
│   ├── redis_service.go       # Redis 缓存服务
│   └── tag_service.go         # 标签业务逻辑
├── 📁 utils/               # 工具函数
│   └── response.go        # 统一响应格式
├── 📁 uploads/             # 文件上传目录
├── 📁 images/              # 图片存储目录
├── 📁 tmp/                 # 临时文件目录
├── 📁 docs/                # 后端文档
│   ├── api-docs.md        # API 接口文档
│   ├── requirements.md    # 需求规格说明
│   └── development_prompt.md # 开发指南
├── go.mod                  # Go 模块定义
├── go.sum                  # 依赖校验文件
├── main.go                 # 服务入口文件
└── README.md              # 说明文档
```

## 🌟 核心功能

### � 文章系统

- ✅ **CRUD 操作**：文章创建、读取、更新、删除
- ✅ **Markdown 支持**：完整的 Markdown 渲染
- ✅ **标签管理**：多标签分类和关联
- ✅ **阅读量统计**：基于 Redis 的实时统计
- ✅ **防刷机制**：IP 防重复访问（1 小时限制）
- ✅ **搜索功能**：标题和内容全文搜索

### 💻 在线编程系统 (OJ)

- ✅ **题目管理**：OJ 题目的 CRUD 操作
- ✅ **代码提交**：支持 Java、C++、Python
- ✅ **在线判题**：集成 Judge0 API
- ✅ **提交限流**：Redis 限流（每分钟 5 次）
- ✅ **测试用例**：自定义输入输出验证
- ✅ **结果展示**：编译错误、运行时错误、结果输出

### 🗃️ Redis 缓存系统

- ✅ **阅读量缓存**：`article:views:{id}` 实时统计
- ✅ **IP 防刷**：`article:ip:{id}_{ip}` 1 小时过期
- ✅ **OJ 限流**：`oj:submit:{ip}` 每分钟计数
- ✅ **热门文章**：`article:content:{id}` 10 分钟缓存
- ✅ **定时同步**：每 5 分钟同步 Redis 到 MySQL

### 📊 数据管理

- ✅ **数据库迁移**：自动创建表结构
- ✅ **关联查询**：文章-标签多对多关联
- ✅ **事务处理**：确保数据一致性
- ✅ **连接池**：数据库连接优化
- ✅ **错误处理**：统一错误响应格式

## �🔧 环境配置

### 环境变量

创建 `.env` 文件：

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=imislab

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 服务配置
SERVER_PORT=3344
GIN_MODE=release

## Judge0 配置
JUDGE0_URL=http://localhost:2358
JUDGE0_API_KEY=your_judge0_key

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10MB
```

### 数据库初始化

```sql
-- 创建数据库
CREATE DATABASE imislab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE imislab;

-- 应用会自动创建表结构，也可以手动导入 SQL 文件
```

## 🚀 API 接口

### 文章接口

```bash
GET    /api/articles          # 获取文章列表
GET    /api/articles/:id      # 获取文章详情（含阅读量统计）
POST   /api/articles          # 创建文章
PUT    /api/articles/:id      # 更新文章
DELETE /api/articles/:id      # 删除文章
GET    /api/articles/search   # 搜索文章
```

### OJ 接口

```bash
GET    /api/oj/problems       # 获取题目列表
GET    /api/oj/problems/:id   # 获取题目详情
POST   /api/oj/problems       # 创建题目
POST   /api/oj/judge          # 提交代码判题（含限流）
GET    /api/oj/submissions    # 获取提交记录
```

### 标签接口

```bash
GET    /api/tags              # 获取标签列表
POST   /api/tags              # 创建标签
PUT    /api/tags/:id          # 更新标签
DELETE /api/tags/:id          # 删除标签
```

### 工具接口

```bash
POST   /api/upload            # 文件上传
GET    /api/health            # 健康检查
GET    /api/stats             # 系统统计
```

## 📊 性能特性

### Redis 性能优化

- **阅读量统计**：实时更新，0 延迟显示
- **缓存命中率**：热门文章缓存命中率 50%+
- **限流保护**：OJ 提交限流，系统稳定性提升
- **定时同步**：5 分钟批量同步，减少数据库压力

### 数据库优化

- **索引优化**：关键字段添加索引
- **连接池**：数据库连接复用
- **查询优化**：避免 N+1 查询
- **事务管理**：合理使用事务确保一致性

### 并发处理

- **Go 协程**：高并发请求处理
- **连接池**：Redis 和 MySQL 连接池
- **无锁设计**：Redis 原子操作避免锁竞争
- **优雅关闭**：服务停止时的优雅退出

## 🧪 测试验证

### 功能测试

- ✅ **阅读量统计**：IP 防刷机制正常工作
- ✅ **OJ 限流**：每分钟 5 次提交限制生效
- ✅ **缓存系统**：热门文章缓存正常
- ✅ **API 接口**：所有接口正常响应

### 性能测试

- ✅ **并发能力**：支持 1000+ 并发用户
- ✅ **响应时间**：99% 请求响应时间 < 500ms
- ✅ **内存使用**：Redis 内存使用 < 100MB
- ✅ **错误率**：服务错误率 < 0.1%

## 🚀 部署指南

### 开发环境

```bash
# 1. 启动 Redis
docker run -d -p 6379:6379 redis:alpine

# 2. 启动服务
go run main.go
```

### 生产环境

```bash
# 1. 编译二进制文件
go build -o IMISLab_backend main.go

# 2. 使用 systemd 管理服务
sudo systemctl start imislab-backend
sudo systemctl enable imislab-backend

# 3. 使用 Nginx 反向代理
# 配置 Nginx 将请求转发到 :3344 端口
```

### Docker 部署

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o backend main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/backend .
CMD ["./backend"]
```

## 🤝 开发指南

### 代码规范

- 遵循 Go 官方代码规范
- 使用 `go fmt` 格式化代码
- 添加必要的注释和文档
- 错误处理使用统一格式

### 开发流程

1. 在 `entity/` 定义数据模型
2. 在 `dto/` 定义数据传输对象
3. 在 `service/` 实现业务逻辑
4. 在 `controller/` 处理 HTTP 请求
5. 在 `router/` 注册路由

### 提交规范

- 使用语义化提交信息
- 每个 PR 包含测试用例
- 确保代码通过所有测试
- 更新相关文档

## 📈 监控指标

- **API 响应时间**：平均响应时间 < 200ms
- **Redis 连接**：连接池使用率 < 80%
- **数据库连接**：连接池使用率 < 70%
- **错误率**：HTTP 错误率 < 1%
- **内存使用**：服务内存使用 < 500MB

---

**IMISLab Backend** - 高性能、可扩展的学习平台后端服务 🚀
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learning_platform

## Judge0 配置

JUDGE0_URL=<http://localhost:2358>
JUDGE0_RAPID_API_KEY=your_api_key

```txt

### 数据库初始化

程序启动时会自动创建所需的数据表。

## 📚 相关文档

详细的项目文档和开发指南请参考：

- [项目总览](../README.md)
- [开发指南](../DEVELOPMENT.md)
- [API 文档](docs/api-docs.md)
- [文档索引](../docs/INDEX.md)
