# 开发指南

## 🚀 开发环境设置

### 系统要求

- Node.js 18.0+
- Go 1.21+
- MySQL 8.0+ 或 PostgreSQL 13+
- Git

### 快速启动

#### 1. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend  
go mod download
```

#### 2. 环境配置

```bash
# 复制配置文件
cp .env.example .env

# 编辑配置
nano .env
```

#### 3. 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE learning_platform;"

# 运行迁移 (后端会自动创建表)
cd backend
go run main.go
```

#### 4. 启动服务

```bash
# 前端开发服务器 (端口 5173)
cd frontend
npm run dev

# 后端服务器 (端口 8080)
cd backend
go run main.go

# 或使用 Docker
docker-compose up -d
```

## 📁 项目结构详解

### 前端架构 (`frontend/`)

```
src/
├── api/              # API 接口封装
├── components/       # Vue 组件
│   ├── common/       # 通用组件
│   ├── article/      # 文章相关
│   ├── oj/           # 在线判题
│   └── admin/        # 管理界面
├── composables/      # 组合式函数
├── stores/           # Pinia 状态管理
├── types/            # TypeScript 类型
├── utils/            # 工具函数
├── views/            # 页面组件
└── config/           # 配置文件
```

### 后端架构 (`backend/`)

```
├── controller/       # 控制器层
├── service/          # 业务逻辑层  
├── entity/           # 数据模型
├── dto/              # 数据传输对象
├── router/           # 路由配置
├── middleware/       # 中间件
├── config/           # 配置管理
└── utils/            # 工具函数
```

## 🛠️ 开发规范

### 前端规范

#### 组件命名

```typescript
// ✅ 正确 - PascalCase
export default defineComponent({
  name: 'ArticleCard'
})

// ❌ 错误 - kebab-case
export default defineComponent({
  name: 'article-card'
})
```

#### 类型定义

```typescript
// ✅ 使用接口定义数据结构
interface Article {
  id: number
  title: string
  content: string
  createdAt: Date
}

// ✅ 使用泛型提高复用性
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
```

### 后端规范

#### API 路径设计

```go
// ✅ RESTful 风格
GET    /api/articles         // 获取文章列表
POST   /api/articles         // 创建文章
GET    /api/articles/:id     // 获取单篇文章
PUT    /api/articles/:id     // 更新文章
DELETE /api/articles/:id     // 删除文章
```

## 🧪 测试策略

### 前端测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run coverage
```

### 后端测试

```bash
# 运行测试
go test ./...

# 测试覆盖率
go test -cover ./...
```

## 📊 性能优化

### 前端优化

- 代码分割与懒加载
- 图片压缩与 WebP 格式
- CSS 原子化 (UnoCSS)
- 虚拟列表 (大数据量)

### 后端优化

- 数据库索引优化
- Redis 缓存策略
- 连接池管理
- API 响应压缩

## 🚨 常见问题

### Q: 前端开发服务器启动失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 应该 >= 18.0
```

### Q: 后端数据库连接失败

```bash
# 检查数据库配置
nano backend/config/database.go

# 确认数据库服务状态
systemctl status mysql
```

## 📚 参考资源

- [Vue 3 文档](https://vuejs.org/)
- [Go Gin 文档](https://gin-gonic.com/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [TailwindCSS 文档](https://tailwindcss.com/)

---

如有问题请查看项目 Issues 或联系维护者。
