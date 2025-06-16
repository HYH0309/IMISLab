# BaseEditor 组件修复说明

## 🔧 修复内容

### 1. 语法高亮问题

- ✅ 更新了 CodeMirror 配置，使用正确的语言模式
- ✅ 安装了语言支持包：`@codemirror/lang-java`, `@codemirror/lang-cpp`, `@codemirror/lang-python`
- ✅ 优化了语法高亮样式

### 2. 图标显示问题  

- ✅ 更新图标类名为 UnoCSS 兼容格式
- ✅ 安装了所需图标集：`@iconify-json/vscode-icons`, `@iconify-json/mingcute`
- ✅ 使用 VSCode 风格的文件类型图标

### 3. 组件功能增强

- ✅ 添加了代码格式化功能
- ✅ 添加了重置和清空代码功能
- ✅ 改进了语言切换时的代码模板
- ✅ 添加了键盘快捷键支持（Ctrl+Enter 提交）
- ✅ 改进了提交状态反馈

## 🎨 UI 改进

### 新的界面特性

1. **现代化工具栏**：包含语言选择器和工具按钮
2. **状态指示**：加载、成功、错误状态的视觉反馈
3. **深色模式支持**：完整的深色主题适配
4. **响应式设计**：适配不同屏幕尺寸

### 语言支持

- **Java**: 完整语法高亮和代码模板
- **C++**: 包含头文件和命名空间的模板  
- **Python**: 函数定义和主程序结构

## 📖 使用方法

### 基本用法

```vue
<template>
  <BaseEditor @submit="handleCodeSubmit" />
</template>

<script setup>
import BaseEditor from '@/components/composable/BaseEditor.vue'

const handleCodeSubmit = (payload) => {
  console.log('提交的代码:', payload.code)
  console.log('语言:', payload.language)
  console.log('语言模式:', payload.languageMode)
}
</script>
```

### 高级用法

```vue
<template>
  <BaseEditor 
    ref="editorRef"
    @submit="handleCodeSubmit" 
  />
  <button @click="formatCode">格式化</button>
  <button @click="resetCode">重置</button>
</template>

<script setup>
import { ref } from 'vue'
import BaseEditor from '@/components/composable/BaseEditor.vue'

const editorRef = ref()

// 外部控制编辑器
const formatCode = () => editorRef.value?.formatCode()
const resetCode = () => editorRef.value?.resetCode()
const getCurrentCode = () => editorRef.value?.getCurrentCode()
const setLanguage = (lang) => editorRef.value?.setLanguage(lang)
</script>
```

## 🔑 API 接口

### Props

无需 props，组件是完全自包含的。

### Events

- `@submit`: 代码提交事件

  ```typescript
  {
    code: string,
    language: 'java' | 'cpp' | 'python',
    languageMode: string
  }
  ```

### 暴露的方法

- `submitCode()`: 手动触发提交
- `formatCode()`: 格式化当前代码
- `resetCode()`: 重置为默认模板
- `clearCode()`: 清空编辑器
- `getCurrentCode()`: 获取当前代码
- `setCode(code: string)`: 设置代码内容
- `getCurrentLanguage()`: 获取当前语言
- `setLanguage(lang: string)`: 设置语言

## 🎯 键盘快捷键

- `Ctrl+Enter` / `Cmd+Enter`: 提交代码
- `Ctrl+S` / `Cmd+S`: 提交代码（另一种方式）

## 🎨 样式自定义

组件使用 Tailwind CSS / UnoCSS 类，可以通过以下方式自定义：

```vue
<BaseEditor class="my-custom-editor" />

<style>
.my-custom-editor {
  @apply shadow-lg rounded-xl;
}

.my-custom-editor :deep(.editor-toolbar) {
  @apply bg-blue-50;
}
</style>
```

## 🔧 故障排除

### 语法高亮不工作

1. 确保安装了语言包：`npm install @codemirror/lang-java @codemirror/lang-cpp @codemirror/lang-python`
2. 检查 CodeMirror 版本兼容性

### 图标不显示

1. 确保安装了图标集：`npm install @iconify-json/vscode-icons @iconify-json/mingcute`
2. 检查 UnoCSS 配置中的 `presetIcons`

### 深色模式问题

组件会自动跟随系统深色模式，如果有问题请检查项目的深色模式配置。

## 📦 依赖版本

- `codemirror`: ^6.0.1
- `codemirror-editor-vue3`: ^2.8.0
- `@codemirror/lang-java`: 最新版本
- `@codemirror/lang-cpp`: 最新版本  
- `@codemirror/lang-python`: 最新版本
- `@iconify-json/vscode-icons`: 最新版本
- `@iconify-json/mingcute`: 最新版本
