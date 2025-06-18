# IMISLab - 个人学习平台

## 🚀 快速启动

### 一键启动（推荐）

```powershell
# PowerShell 启动
.\start-project.ps1
```

```cmd
# 或使用批处理文件
start-project.bat
```

### VS Code 中启动

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Tasks: Run Task"
3. 选择 "🚀 一键启动项目"

详细启动说明请查看 [一键启动指南.md](./一键启动指南.md)

## 🎯 项目简介

一个集成了文章发布、在线判题(OJ)、标签管理等功能的现代化学习管理平台。支持 Markdown 文章发布、代码在线判题、评论系统等功能。

## ✨ 主要特性

### 📝 内容管理

- **文章系统**: 支持 Markdown 格式，TOC 目录生成，评论功能
- **标签管理**: 分类标签，批量操作，可视化管理
- **图片上传**: 支持拖拽上传，图片压缩优化

### 💻 在线判题 (OJ)

- **题目管理**: 创建、编辑、删除编程题目
- **代码提交**: 支持多种编程语言 (C/C++, Python, Java, JavaScript)
- **实时判题**: 在线编译执行，实时结果反馈
- **测试用例**: 自定义输入输出测试

### 🎨 用户体验

- **响应式设计**: 支持桌面端和移动端
- **暗色模式**: 护眼的深色主题
- **进度条**: 页面滚动进度实时显示
- **无障碍支持**: WCAG 2.1 AA 标准合规

### 🎵 额外功能

- **音乐播放器**: 背景音乐播放
- **画廊展示**: 交互式时代变迁展示
- **搜索排序**: 可视化搜索算法演示
- **动态规划**: 算法可视化学习

## 🛠️ 技术栈

### 前端

- **框架**: Vue 3 + TypeScript + Vite
- **UI框架**: UnoCSS + TailwindCSS
- **动画**: Motion-v (Vue版 Framer Motion)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **编辑器**: Monaco Editor
- **Markdown**: markdown-it + KaTeX

### 后端

- **语言**: Go 1.21+
- **框架**: Gin + GORM
- **数据库**: MySQL/PostgreSQL
- **文件存储**: 本地存储 + 云存储支持
- **API文档**: Swagger

### 开发工具

- **构建工具**: Vite + ESBuild
- **代码规范**: ESLint + Prettier
- **测试**: Playwright E2E 测试
- **容器化**: Docker + Docker Compose

## 📦 快速开始

### 环境要求

- Node.js 18+
- Go 1.21+
- MySQL 8.0+ 或 PostgreSQL 13+

### 安装与运行

#### 1. 克隆项目

```bash
git clone <repository-url>
cd "Learing for Ourselves"
```

#### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

#### 3. 后端启动

```bash
cd backend
go mod download
go run main.go
```

#### 4. 使用 Docker (推荐)

```bash
docker-compose up -d
```

### 访问地址

- 前端: <http://localhost:5173>
- 后端API: <http://localhost:3344>
- API文档: <http://localhost:8080/swagger/index.html>

## 🏗️ 项目结构

```text
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/      # Vue 组件
│   │   ├── views/           # 页面视图
│   │   ├── composables/     # 组合式函数
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # 类型定义
│   │   └── utils/           # 工具函数
│   ├── docs/                # 前端文档
│   └── public/              # 静态资源
├── backend/                 # 后端项目
│   ├── controller/          # 控制器
│   ├── service/             # 业务逻辑
│   ├── entity/              # 数据模型
│   ├── dto/                 # 数据传输对象
│   ├── router/              # 路由配置
│   ├── config/              # 配置文件
│   └── docs/                # 后端文档
├── docs/                    # 项目文档
└── docker-compose.yml       # Docker 配置
```

## 🚀 主要功能模块

### 文章管理

- 创建、编辑、删除文章
- Markdown 编辑器，支持实时预览
- 文章分类标签系统
- 评论与回复功能
- 文章导出 (Markdown 格式)

### 在线判题系统

- 题目管理 (CRUD)
- 多语言代码提交
- 实时编译与判题
- 测试用例管理
- 提交历史记录

### 用户界面

- 响应式设计，移动端友好
- 暗色/亮色主题切换
- 平滑页面过渡动画
- 滚动进度指示器
- 无障碍性优化

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### API 设计

- RESTful API 风格
- 统一的错误处理
- 请求/响应数据验证
- API 版本管理

### 测试策略

- 单元测试 (Vitest)
- 端到端测试 (Playwright)
- API 接口测试
- 性能测试

## 📈 性能优化

### 前端优化

- 代码分割与懒加载
- 图片压缩与格式优化
- CSS 原子化 (UnoCSS)
- 虚拟列表 (大数据量)
- Service Worker 缓存

### 后端优化

- 数据库索引优化
- API 响应缓存
- 文件上传优化
- 连接池管理

## 🔒 安全性

- 输入数据验证与过滤
- SQL 注入防护
- XSS 攻击防护
- CSRF 令牌验证
- 文件上传安全检查

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📝 更新日志

### v2.0.0 (2024-06)

- ✨ 全面重构前后端架构
- ✨ 新增在线判题系统
- ✨ 优化用户界面和体验
- ✨ 增强无障碍性支持
- 🐛 修复大量已知问题

### v1.0.0 (2024-01)

- 🎉 初始版本发布
- ✨ 基础文章管理功能
- ✨ 用户评论系统

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 维护者

- **主要开发者**: [Your Name]
- **邮箱**: <your.email@example.com>

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

---

**🌟 如果这个项目对你有帮助，请给它一个 Star！**
