import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'unplugin-vue-markdown/vite'
import Components from 'unplugin-vue-components/vite'
import { katex } from '@mdit/plugin-katex'
import table from 'markdown-it-multimd-table'
import mermaidItMarkdown from 'mermaid-it-markdown' // Mermaid 图表支持
import hljsMarkdown from 'markdown-it-highlightjs'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3344', // 必须包含协议头
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 现在请求流程：
        // /api/articles/1 → http://localhost:3344/articles/1
      },
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      script: {
        defineModel: true,
      },
    }),
    UnoCSS(),
    Components({
      dts: true,
      dirs: ['src/components', 'src/docs'],
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
        langPrefix: 'language-', // 代码块的语言类前缀
      },
      markdownItSetup(md) {
        md.use(hljsMarkdown).use(katex).use(table).use(mermaidItMarkdown)
      },
      wrapperClasses: 'markdown-body',
    }),
    vueDevTools(),
  ],
  build: {
    assetsInlineLimit: 10240, // 10KB
    rollupOptions: {
      output: {
        manualChunks: {
          mermaid: ['mermaid'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      docs: fileURLToPath(new URL('./src/docs', import.meta.url)),
    },
  },
})
