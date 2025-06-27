# IMISLab 项目结构说明

## 📁 项目总览

IMISLab 是一个现代化的学习平台，采用前后端分离架构。

```txt
IMISLab/
├── frontend/                 # Vue3 前端项目
├── backend/                  # Go 后端项目  
├── redis/                    # Redis 数据库
└── README.md                 # 项目说明文档
```

## 🎨 前端核心目录

```txt
frontend/src/
├── main.ts                   # 应用程序入口
├── App.vue                   # 根组件
├── components/               # 可复用组件
│   └── AIAssistant.vue      # AI助手组件
├── views/                    # 页面视图
├── api/                      # API接口层
├── stores/                   # 状态管理(Pinia)
├── router/                   # 路由配置
├── types/                    # TypeScript类型定义
├── utils/                    # 工具函数
├── composables/              # 组合式函数
└── assets/                   # 静态资源
```

## 🔧 后端结构

```txt
backend/
├── main.go                   # 程序入口
├── controller/               # 控制器层(处理HTTP请求)
├── service/                  # 业务逻辑层
├── entity/                   # 数据模型层
└── router/                   # 路由配置
```

## 快速开始

```bash
# 启动项目
.\start.ps1

# 访问地址
# 前端: http://localhost:5173
# 后端: http://localhost:3344
```

## 📋 AI助手相关文件

- **主组件**: `frontend/src/components/AIAssistant.vue`
- **样式配置**: `frontend/src/config/z-index.ts`
- **使用位置**: `frontend/src/App.vue`

**作用**: 管理所有后端接口调用，统一处理请求和响应。

### 📁 components/ - 可复用组件

```txt
components/
├── 📄 NavBar.vue             # 导航栏组件
├── 📄 ThemeToggle.vue        # 主题切换组件
├── 📄 AIAssistant.vue        # AI助手组件 (你要优化的!)
├── 📄 MusicPlayer.vue        # 音乐播放器
├── 📄 GalleryItem.vue        # 图片展示组件
├── 📁 admin/                 # 管理员相关组件
├── 📁 article/               # 文章相关组件
├── 📁 oj/                    # 在线编程相关组件
└── 📁 common/                # 通用组件
```

**作用**: 存放可重复使用的Vue组件，提高代码复用性。

#### 📁 views/ - 页面视图

```txt
views/
├── 📄 HomeView.vue           # 首页
├── 📄 ArticleView.vue        # 文章页面
├── 📄 OJView.vue             # 在线编程页面
├── 📁 admin/                 # 管理员页面
└── 📁 其他页面...
```

**作用**: 存放完整的页面组件，对应路由的页面。

#### 📁 composables/ - 组合式函数

```txt
composables/
├── 📄 useAdminCrud.ts        # 管理员CRUD操作
├── 📄 useAnimatedStats.ts    # 动画统计
├── 📄 useArticleSearch.ts    # 文章搜索
├── 📄 useAuth.ts             # 用户认证
├── 📄 useTheme.ts            # 主题管理
└── 📄 其他工具函数...
```

**作用**: 存放可复用的业务逻辑，Vue3 Composition API的精髓。

#### 📁 stores/ - 状态管理

```txt
stores/
├── 📄 auth.ts                # 用户认证状态
├── 📄 theme.ts               # 主题状态
├── 📄 article.ts             # 文章状态
└── 📄 其他状态管理...
```

**作用**: 使用Pinia管理全局状态，类似Vuex但更轻量。

#### 📁 router/ - 路由配置

```txt
router/
├── 📄 index.ts               # 路由主配置
└── 📄 routes.ts              # 路由定义
```

**作用**: 管理单页面应用的路由跳转。

#### 📁 types/ - TypeScript类型定义

```txt
types/
├── 📄 api.ts                 # API相关类型
├── 📄 article.ts             # 文章相关类型
├── 📄 user.ts                # 用户相关类型
└── 📄 common.ts              # 通用类型
```

**作用**: 提供TypeScript类型安全，减少运行时错误。

#### 📁 utils/ - 工具函数

```txt
utils/
├── 📄 format.ts              # 格式化工具
├── 📄 request.ts             # 请求工具
├── 📄 validation.ts          # 验证工具
└── 📄 其他工具...
```

**作用**: 存放纯函数工具，提高代码复用性。

#### 📁 assets/ - 静态资源

```txt
assets/
├── 📄 main.css               # 全局样式
├── 📄 logo.svg               # Logo图标
├── 📁 images/                # 图片资源
└── 📁 fonts/                 # 字体文件
```

**作用**: 存放项目中使用的静态资源文件。

#### 📁 config/ - 配置文件

```txt
config/
├── 📄 constants.ts           # 常量定义
├── 📄 env.ts                 # 环境变量
└── 📄 z-index.ts             # 层级管理
```

**作用**: 集中管理项目配置和常量。

### 📁 docs/ - 文档目录

```txt
docs/
├── 📄 ai-assistant-guide.md  # AI助手开发指南 (你在看的!)
├── 📄 ai-api-integration.md  # AI API集成指南
└── 📄 ai-assistant-tasks.md  # 新手任务清单
```

**作用**: 存放项目开发文档和指南。

## 🔧 后端项目结构 (backend/)

### 核心文件

```txt
backend/
├── 📄 main.go                # 程序入口
├── 📄 go.mod                 # Go模块定义
├── 📄 go.sum                 # Go依赖版本锁定
└── 📄 backend.exe            # 编译后的可执行文件
```

### 代码组织

```txt
backend/
├── 📁 controller/            # 控制器层 (处理HTTP请求)
├── 📁 service/               # 业务逻辑层
├── 📁 entity/                # 数据模型层
├── 📁 dto/                   # 数据传输对象
├── 📁 router/                # 路由配置
├── 📁 config/                # 配置管理
├── 📁 middleware/            # 中间件
└── 📁 utils/                 # 工具函数
```

#### 各层职责

- **Controller**: 处理HTTP请求，调用Service
- **Service**: 核心业务逻辑，调用数据库
- **Entity**: 数据库表对应的结构体
- **DTO**: 数据传输对象，API输入输出
- **Router**: 路由配置，URL到Controller的映射

## 💾 Redis 目录 (redis/)

```txt
redis/
├── 📄 redis-server.exe       # Redis服务器
├── 📄 redis-cli.exe          # Redis客户端
├── 📄 redis.windows.conf     # Redis配置文件
└── 📄 dump.rdb               # 数据快照文件
```

**作用**:

- 缓存热门文章
- 存储阅读量统计
- 实现提交限流
- 会话管理

## 🎯 AI助手相关文件位置

### 主要文件

```txt
frontend/src/components/
└── 📄 AIAssistant.vue        # 你要优化的AI助手组件!
```

### 相关配置

```txt
frontend/src/config/
└── 📄 z-index.ts             # 包含AI助手的层级配置
```

### 使用位置

```txt
frontend/src/
└── 📄 App.vue                # AI助手在这里被引用
```

### 文档位置

```txt
frontend/docs/
├── 📄 ai-assistant-guide.md  # 开发指南
├── 📄 ai-api-integration.md  # API集成指南
└── 📄 ai-assistant-tasks.md  # 任务清单
```

## 🚀 开发流程

### 1. 环境准备

```bash
# 克隆项目
git clone <项目地址>
cd IMISLab

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖 (Go会自动处理)
cd ../backend
go mod tidy
```

### 2. 启动服务

```bash
# 方式1: 使用一键启动脚本
.\start.ps1

# 方式2: 手动启动
# 启动Redis
.\redis\redis-server.exe

# 启动后端
cd backend && go run main.go

# 启动前端
cd frontend && npm run dev
```

### 3. 访问应用

- **前端**: <http://localhost:5173>
- **后端API**: <http://localhost:3344>
- **Redis**: localhost:6379

## 📖 技术栈概览

### 前端

Vue 3 + TypeScript + Vite + UnoCSS + Pinia

### 后端  

Go + Gin + GORM + MySQL + Redis

## 🔍 快速定位文件

### AI助手相关

- **主组件**: `frontend/src/components/AIAssistant.vue`
- **配置**: `frontend/src/config/z-index.ts`
- **文档**: `frontend/docs/ai-assistant-*.md`

### 添加新功能

- **页面**: `frontend/src/views/`
- **组件**: `frontend/src/components/`
- **路由**: `frontend/src/router/routes.ts`
- **API**: `frontend/src/api/`

## 💡 开发规范

### 文件命名

- 组件: `PascalCase.vue`
- 函数: `camelCase.ts`
- 常量: `UPPER_SNAKE_CASE`

### Git提交

```bash
feat(ai): 添加新功能
fix(ai): 修复问题
refactor(ai): 重构代码
```

---

**详细的开发指南请查看对应的专门文档。**
