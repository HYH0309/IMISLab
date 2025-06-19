// main.ts
import '@unocss/reset/normalize.css' // 重置样式
import 'github-markdown-css' // Markdown 样式
import 'highlight.js/styles/github.css' // 代码高亮
import '@fontsource/jetbrains-mono' // JetBrains Mono 字体
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import './assets/main.css'

// 确保 UnoCSS 在最后加载
import 'virtual:uno.css'

//
// Vue 应用初始化
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { zIndexDirective, initZIndexVars } from './composables/useZIndex'

// 初始化z-index CSS变量
initZIndexVars()

const app = createApp(App)

// 注册全局指令
app.directive('z-index', zIndexDirective)

app.use(createPinia())
app.use(router)
app.mount('#app')
