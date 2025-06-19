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
import { rimraf } from 'rimraf'
import { glob } from 'glob'
import type { Plugin } from 'vite'

// 自定义清理插件
function cleanupPlugin(): Plugin {
  return {
    name: 'imislab-cleanup',
    buildStart() {
      // 开发模式下清理编译生成的JS文件
      if (process.env.NODE_ENV !== 'production') {
        console.log('🧹 清理开发环境编译生成的文件...')

        try {
          // 清理src目录下意外生成的JS文件（保留配置文件）
          const jsFiles = glob.sync('src/**/*.js', {
            ignore: [
              '**/node_modules/**',
              '**/dist/**',
              '**/*.config.js',
              '**/*.setup.js',
              '**/vite.config.js',
            ],
          })

          if (jsFiles.length > 0) {
            jsFiles.forEach((file) => {
              try {
                rimraf.sync(file)
                console.log(`  🗑️  删除编译生成文件: ${file}`)
              } catch (error) {
                console.warn(`  ⚠️  无法删除: ${file}`)
              }
            })
          }
        } catch (error) {
          // 静默处理错误
        }
      }
    },
    buildEnd() {
      // 构建结束后清理
      console.log('🧹 构建完成，清理临时文件...')

      try {
        // 清理TypeScript增量编译信息
        const tsBuildFiles = ['.tsbuildinfo', 'tsconfig.tsbuildinfo']
        tsBuildFiles.forEach((file) => {
          try {
            rimraf.sync(file)
          } catch (error) {
            // 忽略错误
          }
        })

        console.log('✅ 清理完成')
      } catch (error) {
        // 静默处理错误
      }
    },
  }
}

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
    cleanupPlugin(), // 添加清理插件
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
