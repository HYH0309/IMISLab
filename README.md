# IMISLab - 个人学习平台

## 🎯 快速启动（伪一键版）

号称一键启动，实际需要：

```powershell
# 请先祈祷，然后运行
.\start-project.ps1
```

```cmd
# 或者尝试这个（不保证能行）
start-project.bat
```

### VS Code 中启动

1. 按 `Ctrl+Shift+P` 打开命令面板（如果快捷键没被占用）
2. 输入 "Tasks: Run Task"（记得拼写正确）
3. 选择 "🚀 一键启动项目"（如果它存在的话）

详细启动说明请查看 [一键启动指南.md](./一键启动指南.md)（如果这个文件还存在）

## 🤹 项目简介

一个试图包罗万象但可能什么都做不好的学习平台（毕竟谁不想同时做文章系统、OJ、音乐播放器和画廊呢？）。

主要功能包括：

- Markdown文章发布（大部分时候能正常显示）
- 在线判题系统（编译错误是我们的特色功能）
- 音乐播放器（用来缓解debug时的焦虑）
- 画廊展示（主要展示各种error截图）

## ⚙️ 主要"特性"

### 📝 内容管理

- **文章系统**：我们终于让Markdown能显示了！（大部分时候）
- **标签管理**：因为分类困难所以做了分类功能
- **图片上传**：拖拽上传（但偶尔会把浏览器拖崩溃）

### 💻 在线判题 (OJ)

- **题目管理**：创建题目比解题简单多了不是吗？
- **代码提交**：支持多种语言（只要你不介意偶尔的编译错误）
- **实时判题**：实时？取决于服务器心情...
- **测试用例**：我们精心准备了各种让你意想不到的边界情况

### 🎨 用户体验

- **响应式设计**：在大部分设备上能看（部分机型可能需要眯着眼）
- **暗色模式**：保护眼睛，也保护心灵（看不到bug就是没有bug）
- **进度条**：让你知道页面加载到哪一步卡住了

### 🎵 额外功能

- **音乐播放器**：debug时的背景音乐（音量自动随错误数量增加）
- **画廊展示**：主要展示各种error的艺术截图
- **搜索排序**：可视化演示如何找不到你想要的内容

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

## 📝 更新日志（又名bug记录）

### v2.0.0 (2024-06)

- ✨ 全面重构前后端架构（因为v1实在太烂）
- ✨ 新增在线判题系统（虽然判题结果经常让人困惑）
- ✨ 优化用户界面和体验（从完全不能用变成勉强能用）
- ✨ 增强无障碍性支持（至少我们尝试过了）
- 🐛 修复大量已知问题（又引入了更多新问题）

### v1.0.0 (2024-01)

- 🎉 初始版本发布（当时我们居然敢发布）
- ✨ 基础文章管理功能（如果Markdown乱码也算功能）
- ✨ 用户评论系统（主要用来吐槽系统bug）

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👤 维护者（大概）

- **主要开发者**: [HYH0309]
- **邮箱**: <我们忘记设置邮箱了@example.com>
- **工作时间**: 随缘（通常在凌晨3点突然修复bug）

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

---

**🌟 如果这个项目对你有帮助，请给它一个 Star！**
