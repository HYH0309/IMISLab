# Backend - Learning Platform

基于 Go + Gin + GORM 的高性能后端 API 服务。

## 🚀 快速开始

```bash
# 安装依赖
go mod download

# 启动开发服务器
go run main.go

# 构建二进制文件
go build -o backend main.go
```

## 📦 主要技术栈

- **Go 1.21+** - 高性能编程语言
- **Gin** - 高性能 HTTP Web 框架
- **GORM** - Go 语言 ORM 框架
- **MySQL/PostgreSQL** - 关系型数据库
- **Judge0 API** - 代码执行判题服务

## 🏗️ 项目结构

```text
backend/
├── config/          # 配置文件
│   └── db.go        # 数据库配置
├── controller/      # 控制器层
├── dto/            # 数据传输对象
├── entity/         # 数据库实体
├── middleware/     # 中间件
├── router/         # 路由配置
├── service/        # 业务逻辑层
├── utils/          # 工具函数
├── uploads/        # 文件上传目录
└── docs/           # 后端文档
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learning_platform

# Judge0 配置
JUDGE0_URL=http://localhost:2358
JUDGE0_RAPID_API_KEY=your_api_key
```

### 数据库初始化

程序启动时会自动创建所需的数据表。

## 📚 相关文档

详细的项目文档和开发指南请参考：

- [项目总览](../README.md)
- [开发指南](../DEVELOPMENT.md)
- [API 文档](docs/api-docs.md)
- [文档索引](../docs/INDEX.md)
