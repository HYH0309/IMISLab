# Frontend - Learning Platform

基于 Vue 3 + TypeScript + Vite 的现代化前端应用。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm run test

# E2E 测试
npm run test:e2e
```

## 📦 主要技术栈

- **Vue 3.5+** - 渐进式 JavaScript 框架
- **TypeScript 5.8+** - 类型安全的 JavaScript
- **Vite 6.3+** - 快速构建工具
- **UnoCSS** - 原子化 CSS 引擎
- **Motion-v** - Vue 动画库
- **Pinia** - 状态管理
- **Vue Router 4** - 路由管理

## 🏗️ 项目结构

```text
src/
├── api/             # API 接口封装
├── assets/          # 静态资源
├── components/      # Vue 组件
│   ├── admin/       # 管理员组件
│   ├── article/     # 文章相关组件
│   ├── common/      # 通用组件
│   ├── oj/          # 在线判题组件
│   └── ...
├── composables/     # 组合式函数
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数
└── views/           # 页面视图
```

## 🔧 开发规范

### 代码风格

- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 组件开发

- 优先使用 Composition API
- 合理使用 props 和 emits
- 添加必要的类型注解
- 编写组件文档注释

## 📚 相关文档

详细的项目文档和开发指南请参考：

- [项目总览](../README.md)
- [开发指南](../DEVELOPMENT.md)
- [文档索引](../docs/INDEX.md)
