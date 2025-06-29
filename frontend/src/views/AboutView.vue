<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { ref, watch } from 'vue'
import {
  GlobeAltIcon,
  AcademicCapIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import { Icon } from '@iconify/vue'
import { Motion } from 'motion-v'

// 导入头像图片
import hyAvatar from '@/assets/hy.jpg'
import zyxAvatar from '@/assets/zyx.jpg'
import zxAvatar from '@/assets/zx.jpg'
import zhAvatar from '@/assets/zh.jpg'
import shbAvatar from '@/assets/shb.jpg'

// Tab 状态
</script>

<template>
  <div class="about-container">
    <!-- 头部英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-avatar">
          <img :src="hyAvatar" alt="HY头像"
            class="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30 shadow-xl" />
        </div>
        <h1 class="hero-title">
          😈 华农 IMIS 核废料级程序员 · 架构师（预备役）
        </h1>
        <p class="hero-subtitle">
          专业屎山代码重构 · 技术负债证券化中 · 伪全栈开发（前后端一起崩但能修好）
        </p>
        <p class="hero-description">
          👋 Hi, I'm HYH0309 · 🎓 IMIS/SCAU · 💡 心之所向，素履以往 · 🌱 正在学习/研究全栈开发
          <br />
          <span class="hero-motto">"在紫荆桥下写的 bug，终将成为架构师勋章" —— 自欺欺人版IMIS格言</span>
        </p>
        <div class="hero-contact">
          <div class="contact-links">
            <a href="mailto:Y2433936387@163.com" class="contact-link email">
              <EnvelopeIcon class="w-5 h-5" />
              <span>Y2433936387@163.com</span>
            </a>
            <a href="https://github.com/HYH0309" target="_blank" class="contact-link github">
              <Icon icon="mdi:github" class="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="http://www.hyh0209.cn/" target="_blank" class="contact-link website">
              <Icon icon="mdi:web" class="w-5 h-5" />
              <span>我的个人网站</span>
            </a>
            <div class="contact-link location">
              <Icon icon="mdi:map-marker" class="w-5 h-5" />
              <span>华南农业大学</span>
            </div>
          </div>
        </div>
        <div class="hero-badges">
          <div class="badge badge-warning">
            🏗️ 屎山改造率 3.14%
          </div>
          <div class="badge badge-info">
            💡 技术负债证券化中
          </div>
          <div class="badge badge-success">
            🧪 毒物配制专家
          </div>
          <div class="badge badge-danger">
            🔥 Bug自动孵化器
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 我的队友分区 -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">👥 我的队友</h2>
            <p class="section-subtitle">一起奋斗的小伙伴们</p>
          </div>

          <div class="teammates-grid">
            <Motion :animate="{ y: [0, -12, 0], scale: [1, 1.08, 1] }"
              :transition="{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0 }">
              <div class="teammate-card">
                <div class="teammate-avatar">
                  <Motion :animate="{ rotateY: [0, 5, -5, 0] }"
                    :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }">
                    <img :src="zyxAvatar" alt="ZYX" class="w-24 h-24 rounded-full object-cover" />
                  </Motion>
                  <div class="avatar-overlay">
                    <span class="avatar-text">ZYX</span>
                  </div>
                </div>
                <h3 class="teammate-name">ZYX</h3>
                <p class="teammate-role">创意提供</p>
              </div>
            </Motion>

            <Motion :animate="{ y: [0, -12, 0], scale: [1, 1.08, 1] }"
              :transition="{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }">
              <div class="teammate-card">
                <div class="teammate-avatar">
                  <Motion :animate="{ rotateY: [0, 5, -5, 0] }"
                    :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }">
                    <img :src="zxAvatar" alt="ZX" class="w-24 h-24 rounded-full object-cover" />
                  </Motion>
                  <div class="avatar-overlay">
                    <span class="avatar-text">ZX</span>
                  </div>
                </div>
                <h3 class="teammate-name">ZX</h3>
                <p class="teammate-role">资源收集</p>
              </div>
            </Motion>

            <Motion :animate="{ y: [0, -12, 0], scale: [1, 1.08, 1] }"
              :transition="{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }">
              <div class="teammate-card">
                <div class="teammate-avatar">
                  <Motion :animate="{ rotateY: [0, 5, -5, 0] }"
                    :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }">
                    <img :src="zhAvatar" alt="ZH" class="w-24 h-24 rounded-full object-cover" />
                  </Motion>
                  <div class="avatar-overlay">
                    <span class="avatar-text">ZH</span>
                  </div>
                </div>
                <h3 class="teammate-name">ZH</h3>
                <p class="teammate-role">样式优化</p>
              </div>
            </Motion>

            <Motion :animate="{ y: [0, -12, 0], scale: [1, 1.08, 1] }"
              :transition="{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }">
              <div class="teammate-card">
                <div class="teammate-avatar">
                  <Motion :animate="{ rotateY: [0, 5, -5, 0] }"
                    :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }">
                    <img :src="shbAvatar" alt="SHB" class="w-24 h-24 rounded-full object-cover" />
                  </Motion>
                  <div class="avatar-overlay">
                    <span class="avatar-text">SHB</span>
                  </div>
                </div>
                <h3 class="teammate-name">SHB</h3>
                <p class="teammate-role">数据验证</p>
              </div>
            </Motion>
          </div>
        </div>
      </section>

      <!-- 技能与项目标签页 -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">💻 技能与项目</h2>
          </div>

          <!-- Headless UI 标签页 -->
          <TabGroup as="div" class="relative">
            <TabList
              class="relative flex space-x-2 rounded-2xl bg-white/70 dark:bg-gray-800/70 p-2 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30 w-fit mx-auto overflow-hidden">

              <Tab as="template" v-slot="{ selected }">
                <button :class="[
                  'relative z-10 flex items-center gap-2.5 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300 ease-out hover:scale-105 transform-gpu min-w-[140px] justify-center focus:outline-none',
                  selected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                ]">
                  <LightBulbIcon class="w-5 h-5 transition-all duration-300" :class="selected ? 'animate-pulse' : ''" />
                  <span class="font-bold tracking-wide">正在学习</span>
                </button>
              </Tab>

              <Tab as="template" v-slot="{ selected }">
                <button :class="[
                  'relative z-10 flex items-center gap-2.5 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300 ease-out hover:scale-105 transform-gpu min-w-[140px] justify-center focus:outline-none',
                  selected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                ]">
                  <RocketLaunchIcon class="w-5 h-5 transition-all duration-300"
                    :class="selected ? 'animate-bounce' : ''" />
                  <span class="font-bold tracking-wide">我的项目</span>
                </button>
              </Tab>
            </TabList>

            <TabPanels class="mt-12 relative">
              <!-- 技能面板 -->
              <TabPanel :class="[
                'rounded-3xl bg-gradient-to-br from-white/90 to-blue-50/60 dark:from-gray-800/90 dark:to-gray-700/60 p-8 shadow-2xl border border-white/30 dark:border-gray-600/30',
                'ring-blue-500/30 ring-offset-4 ring-offset-transparent focus:outline-none focus:ring-2',
                'backdrop-blur-xl transition-all duration-700 ease-out transform',
                'data-[headlessui-state~=selected]:animate-slideIn',
              ]" style="animation-fill-mode: both;">
                <div class="learning-content">
                  <div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="learning-plan-card">
                        <div class="flex items-center gap-3 mb-4">
                          <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <h4 class="font-bold text-lg text-gray-800 dark:text-white">前端进阶</h4>
                        </div>
                        <ul class="space-y-2">
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-green-500">✓</span>
                            Vue 3 Composition API
                          </li>
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-yellow-500">◐</span>
                            TypeScript 高级特性
                          </li>
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-blue-500">○</span>
                            Nuxt.js 全栈框架
                          </li>
                        </ul>
                      </div>

                      <div class="learning-plan-card">
                        <div class="flex items-center gap-3 mb-4">
                          <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          <h4 class="font-bold text-lg text-gray-800 dark:text-white">后端探索</h4>
                        </div>
                        <ul class="space-y-2">
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-green-500">✓</span>
                            Go 语言基础语法
                          </li>
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-yellow-500">◐</span>
                            Gin 框架开发
                          </li>
                          <li class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span class="text-blue-500">○</span>
                            微服务架构
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="skills-progress">
                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="85">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-vue)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="34" />
                          <defs>
                            <linearGradient id="gradient-vue" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#10b981" />
                              <stop offset="100%" style="stop-color:#059669" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:vue" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">Vue 3</h3>
                        <span class="skill-percentage">85%</span>
                        <p class="skill-desc">能够独立开发中等复杂度的项目</p>
                      </div>
                    </div>

                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="70">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-ts)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="68" />
                          <defs>
                            <linearGradient id="gradient-ts" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#3b82f6" />
                              <stop offset="100%" style="stop-color:#1d4ed8" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:typescript-icon" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">TypeScript</h3>
                        <span class="skill-percentage">70%</span>
                        <p class="skill-desc">掌握基本语法和类型系统</p>
                      </div>
                    </div>

                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="55">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-mysql)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="102" />
                          <defs>
                            <linearGradient id="gradient-mysql" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#0ea5e9" />
                              <stop offset="100%" style="stop-color:#0284c7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:mysql" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">MySQL</h3>
                        <span class="skill-percentage">55%</span>
                        <p class="skill-desc">掌握基本SQL语法</p>
                      </div>
                    </div>

                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="45">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-go)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="124" />
                          <defs>
                            <linearGradient id="gradient-go" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#06b6d4" />
                              <stop offset="100%" style="stop-color:#0891b2" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:go" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">Go</h3>
                        <span class="skill-percentage">45%</span>
                        <p class="skill-desc">学习基础语法</p>
                      </div>
                    </div>

                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="40">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-redis)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="136" />
                          <defs>
                            <linearGradient id="gradient-redis" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#ef4444" />
                              <stop offset="100%" style="stop-color:#dc2626" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:redis" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">Redis</h3>
                        <span class="skill-percentage">40%</span>
                        <p class="skill-desc">学习缓存设计和基本操作</p>
                      </div>
                    </div>

                    <div class="skill-item">
                      <div class="circular-progress" data-percentage="30">
                        <svg class="progress-ring" width="80" height="80">
                          <circle class="progress-ring__circle-bg" stroke="#e5e7eb" stroke-width="4" fill="transparent"
                            r="36" cx="40" cy="40" />
                          <circle class="progress-ring__circle" stroke="url(#gradient-rust)" stroke-width="4"
                            fill="transparent" r="36" cx="40" cy="40" stroke-dasharray="226.195"
                            stroke-dashoffset="158" />
                          <defs>
                            <linearGradient id="gradient-rust" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#f97316" />
                              <stop offset="100%" style="stop-color:#ea580c" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div class="progress-center">
                          <Icon icon="logos:rust" class="w-6 h-6" />
                        </div>
                      </div>
                      <div class="skill-info">
                        <h3 class="skill-name">Rust</h3>
                        <span class="skill-percentage">30%</span>
                        <p class="skill-desc">刚开始接触</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <!-- 项目面板 -->
              <TabPanel :class="[
                'rounded-3xl bg-gradient-to-br from-white/90 to-purple-50/60 dark:from-gray-800/90 dark:to-gray-700/60 p-8 shadow-2xl border border-white/30 dark:border-gray-600/30',
                'ring-purple-500/30 ring-offset-4 ring-offset-transparent focus:outline-none focus:ring-2',
                'backdrop-blur-xl transition-all duration-700 ease-out transform',
                'data-[headlessui-state~=selected]:animate-slideIn',
              ]" style="animation-fill-mode: both;">

                <div class="project-grid">
                  <div class="project-card">
                    <div class="project-header">
                      <div class="project-header-left">
                        <AcademicCapIcon class="project-icon" />
                        <div class="project-status status-active">
                          <span class="status-dot"></span>
                          开发中
                        </div>
                      </div>
                      <a href="https://github.com/HYH0309/IMISLab" target="_blank" class="github-link">
                        <GlobeAltIcon class="w-4 h-4" />
                      </a>
                    </div>
                    <h3 class="project-title">🎓 IMISLab 华农信管实验室</h3>
                    <p class="project-description">
                      现代化的实验室管理平台，集成文章发布、在线判题、音乐播放等功能。
                    </p>
                    <div class="project-features">
                      <div class="feature-item">📝 Markdown编辑器</div>
                      <div class="feature-item">🏆 OJ在线判题</div>
                      <div class="feature-item">🎵 音乐播放器</div>
                      <div class="feature-item">📊 数据图表</div>
                    </div>
                    <div class="project-stats">
                      <div class="stat-item">
                        <span class="stat-number">15+</span>
                        <span class="stat-label">功能模块</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">3k+</span>
                        <span class="stat-label">代码行数</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">85%</span>
                        <span class="stat-label">完成度</span>
                      </div>
                    </div>
                    <div class="project-tags">
                      <span class="tag tag-vue">Vue 3</span>
                      <span class="tag tag-go">Go</span>
                      <span class="tag tag-mysql">MySQL</span>
                      <span class="tag tag-redis">Redis</span>
                      <span class="tag tag-ts">TypeScript</span>
                    </div>
                  </div>

                  <div class="project-card">
                    <div class="project-header">
                      <div class="project-header-left">
                        <DocumentTextIcon class="project-icon" />
                        <div class="project-status status-legacy">
                          <span class="status-dot"></span>
                          祖传屎山
                        </div>
                      </div>
                      <a href="https://github.com/HYH0309/student-manage-system" target="_blank" class="github-link">
                        <GlobeAltIcon class="w-4 h-4" />
                      </a>
                    </div>
                    <h3 class="project-title">💩 学生信息管理系统</h3>
                    <p class="project-description">
                      课设产物，包含学生、教师、管理员三端，支持成绩管理、课程安排等功能。
                    </p>
                    <div class="project-features">
                      <div class="feature-item">👨‍🎓 多角色管理</div>
                      <div class="feature-item">📚 课程系统</div>
                      <div class="feature-item">📊 成绩统计</div>
                      <div class="feature-item">🔐 权限控制</div>
                    </div>
                    <div class="project-stats">
                      <div class="stat-item">
                        <span class="stat-number">3</span>
                        <span class="stat-label">用户角色</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">2k+</span>
                        <span class="stat-label">代码行数</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">60%</span>
                        <span class="stat-label">代码质量</span>
                      </div>
                    </div>
                    <div class="project-tags">
                      <span class="tag tag-vue">Vue 3</span>
                      <span class="tag tag-spring">Spring Boot</span>
                      <span class="tag tag-mysql">MySQL</span>
                    </div>
                  </div>

                  <div class="project-card">
                    <div class="project-header">
                      <div class="project-header-left">
                        <RocketLaunchIcon class="project-icon" />
                        <div class="project-status status-experimental">
                          <span class="status-dot"></span>
                          自虐作品
                        </div>
                      </div>
                      <a href="https://github.com/HYH0309/cvue" target="_blank" class="github-link">
                        <GlobeAltIcon class="w-4 h-4" />
                      </a>
                    </div>
                    <h3 class="project-title">🦀 cvue - Rust CLI工具</h3>
                    <p class="project-description">
                      用Rust开发的Vue模板管理工具，支持彩色终端输出和跨平台使用。
                    </p>
                    <div class="project-features">
                      <div class="feature-item">🎨 彩色终端</div>
                      <div class="feature-item">📦 模板管理</div>
                      <div class="feature-item">🚀 跨平台支持</div>
                    </div>
                    <div class="project-stats">
                      <div class="stat-item">
                        <span class="stat-number">37+</span>
                        <span class="stat-label">依赖包数</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">CLI</span>
                        <span class="stat-label">工具类型</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">95%</span>
                        <span class="stat-label">完成度</span>
                      </div>
                    </div>
                    <div class="project-tags">
                      <span class="tag tag-rust">Rust</span>
                      <span class="tag tag-cli">CLI</span>
                      <span class="tag tag-vue">Vue</span>
                    </div>
                  </div>

                  <div class="project-card">
                    <div class="project-header">
                      <div class="project-header-left">
                        <GlobeAltIcon class="project-icon" />
                        <div class="project-status status-stable">
                          <span class="status-dot"></span>
                          优化完成
                        </div>
                      </div>
                      <a href="https://github.com/HYH0309/MyWeb" target="_blank" class="github-link">
                        <GlobeAltIcon class="w-4 h-4" />
                      </a>
                    </div>
                    <h3 class="project-title">🌟 MyWeb - 个人网站</h3>
                    <p class="project-description">
                      个人展示网站，集成技术栈展示、项目分享、音乐播放器等功能。
                    </p>
                    <div class="project-features">
                      <div class="feature-item">🎵 音乐播放器</div>
                      <div class="feature-item">💬 AI 聊天功能</div>
                      <div class="feature-item">📱 响应式设计</div>
                      <div class="feature-item">⚡ 构建优化</div>
                    </div>
                    <div class="project-stats">
                      <div class="stat-item">
                        <span class="stat-number">218KB</span>
                        <span class="stat-label">打包体积</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">95%</span>
                        <span class="stat-label">性能评分</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">100%</span>
                        <span class="stat-label">响应式</span>
                      </div>
                    </div>
                    <div class="project-tags">
                      <span class="tag tag-vue">Vue 3</span>
                      <span class="tag tag-ts">TypeScript</span>
                      <span class="tag tag-vite">Vite</span>
                      <span class="tag tag-element">Element Plus</span>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </section>



    </main>
  </div>
</template>

<style scoped>
.about-container {
  @apply min-h-screen bg-white dark:bg-gray-900;
}

/* 现代化标签页样式 */
.scale-102 {
  transform: scale(1.02);
}

.scale-105 {
  transform: scale(1.05);
}

/* 现代化动画效果 */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Tab 标签页容器增强 */
[role="tablist"] {
  position: relative;
  overflow: visible;
}

/* Tab 按钮悬浮效果 */
[role="tab"] {
  position: relative;
  overflow: visible;
}

[role="tab"]:before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 16px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

[role="tab"]:hover:before {
  opacity: 1;
}

/* TabPanel 动画 */
[role="tabpanel"] {
  animation: slideIn 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* 毛玻璃效果增强 */
.backdrop-blur-xl {
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}

/* 渐变边框效果 */
.gradient-border {
  position: relative;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid transparent;
}

.gradient-border:before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

/* 英雄区域 */
.hero-section {
  @apply py-20 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900;
}

.hero-content {
  @apply max-w-4xl mx-auto px-6;
}

.hero-avatar {
  @apply flex justify-center mb-6;
}

.hero-title {
  @apply text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white;
}

.hero-subtitle {
  @apply text-lg md:text-xl mb-6 text-gray-600 dark:text-gray-400;
}

.hero-description {
  @apply text-base md:text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed;
}

.hero-motto {
  @apply block text-sm text-gray-500 dark:text-gray-400 italic mt-3 border-l-2 border-orange-400 pl-3;
  @apply bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 px-3 py-2 rounded-r-lg;
}

.hero-contact {
  @apply mb-8;
}

.contact-links {
  @apply flex flex-wrap justify-center gap-6;
}

.contact-link {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105;
}

.contact-link.email {
  @apply bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50;
}

.contact-link.github {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}

.contact-link.location {
  @apply bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300;
}

.contact-link.website {
  @apply bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/40;
}

.hero-badges {
  @apply flex flex-wrap justify-center gap-4;
}

.badge {
  @apply px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm;
}

.badge-warning {
  @apply bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
}

.badge-info {
  @apply bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300;
}

.badge-success {
  @apply bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300;
}

.badge-danger {
  @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300;
}

/* 主要内容 */
.section {
  @apply py-12;
}

.section:nth-child(even) {
  @apply bg-gray-50 dark:bg-gray-800/30;
}

.container {
  @apply max-w-5xl mx-auto px-6;
}

.section-header {
  @apply text-center mb-8;
}

.section-title {
  @apply text-3xl font-bold mb-4 text-gray-900 dark:text-white;
}


/* 技能学习部分 */
.learning-content {
  @apply space-y-6;
}

/* 学习计划卡片 */
.learning-plan-card {
  @apply bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30;
  @apply hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-800/80;
}

/* 学习资源卡片 */
.learning-resource-card {
  @apply bg-gradient-to-br from-white/70 to-blue-50/50 dark:from-gray-800/70 dark:to-gray-900/50;
  @apply backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-gray-700/30;
  @apply hover:shadow-md transition-all duration-300 hover:scale-105;
  @apply text-center;
}

/* 学习目标卡片 */
.learning-goal-card {
  @apply bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30;
  @apply hover:shadow-lg transition-all duration-300;
}

.goal-item {
  @apply p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg;
}

/* 队友分区样式 */
.teammates-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto;
}

.teammate-card {
  @apply bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/30 dark:border-gray-700/30;
  @apply hover:shadow-2xl transition-all duration-500 ease-out hover:scale-110 hover:bg-white/90 dark:hover:bg-gray-800/90;
  @apply text-center group cursor-pointer relative overflow-hidden;
  @apply hover:-translate-y-2 transform-gpu;
}

.teammate-card:before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10;
  @apply opacity-0 group-hover:opacity-100 transition-opacity duration-500;
}

.teammate-avatar {
  @apply mb-6 flex justify-center relative;
}

.teammate-avatar img {
  @apply border-4 border-blue-500/20 group-hover:border-purple-500/60 transition-all duration-500;
  @apply shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/25;
  @apply group-hover:scale-110 transform-gpu;
}

.avatar-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-black/60 text-white font-bold text-lg;
  @apply rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300;
  @apply backdrop-blur-sm;
}

.avatar-text {
  @apply transform scale-75 group-hover:scale-100 transition-transform duration-300;
}

.teammate-name {
  @apply text-xl font-bold text-gray-800 dark:text-white mb-3 relative z-10;
  @apply group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300;
}

.teammate-role {
  @apply text-base text-gray-600 dark:text-gray-400 relative z-10;
  @apply group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300;
}

.learning-description {
  @apply text-center max-w-2xl mx-auto mb-8;
}

.description-text {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

.skills-progress {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto;
}

.skill-item {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700;
  @apply text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1;
}

.circular-progress {
  @apply relative inline-block mb-4;
}

.progress-ring {
  @apply transform -rotate-90;
}

.progress-ring__circle-bg {
  @apply dark:stroke-gray-700;
}

.progress-ring__circle {
  @apply transition-all duration-1000 ease-out;
  stroke-linecap: round;
}

.progress-center {
  @apply absolute inset-0 flex items-center justify-center;
}

.skill-info {
  @apply space-y-2;
}

.skill-name {
  @apply text-base font-semibold text-gray-900 dark:text-white;
}

.skill-percentage {
  @apply text-sm font-bold text-blue-600 dark:text-blue-400;
}

.skill-desc {
  @apply text-xs text-gray-600 dark:text-gray-400 leading-tight px-2;
}

/* 项目展示 */
.project-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto;
}

.project-card {
  @apply relative p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300;
  @apply hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.025];
  backdrop-filter: blur(6px);
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.06));
  pointer-events: none;
}

.project-header {
  @apply flex justify-between items-center mb-4 relative z-10;
}

.project-header-left {
  @apply flex items-center gap-3;
}

.project-icon {
  @apply w-8 h-8 text-blue-500 dark:text-blue-400 drop-shadow-md flex-shrink-0;
}

.github-link {
  @apply p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 flex-shrink-0;
}

.project-title {
  @apply text-lg font-bold mb-2 text-gray-900 dark:text-white relative z-10;
}

.project-description {
  @apply text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 relative z-10;
}

.project-features {
  @apply flex flex-wrap gap-2 my-2 relative z-10;
}

.feature-item {
  @apply text-xs bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-700;
}

.project-stats {
  @apply flex justify-between items-center py-2 my-3 bg-gray-50/80 dark:bg-gray-700/60 rounded-xl px-4 relative z-10 shadow-sm;
}

.stat-item {
  @apply text-center flex-1;
}

.stat-number {
  @apply block text-lg font-bold text-blue-600 dark:text-blue-400;
}

.stat-label {
  @apply text-xs text-gray-500 dark:text-gray-300;
}

.project-tags {
  @apply flex flex-wrap gap-2 mt-2 relative z-10;
}

.tag {
  @apply px-2 py-0.5 text-xs rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-sm;
}

.tag-vue {
  @apply bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400;
}

.tag-ts {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400;
}

.tag-go {
  @apply bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400;
}

.tag-mysql {
  @apply bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400;
}

.tag-redis {
  @apply bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400;
}

.tag-rust {
  @apply bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-bold;
}

.tag-cli {
  @apply bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400;
}

.tag-spring {
  @apply bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400;
}

.tag-vite {
  @apply bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400;
}

.tag-element {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400;
}

.tag-status {
  @apply bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-700;
}

.project-status {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap;
}

.project-status .status-dot {
  @apply w-1.5 h-1.5 rounded-full;
}

.status-stable {
  @apply bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400;
}

.status-stable .status-dot {
  @apply bg-green-500;
}

.status-experimental {
  @apply bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400;
}

.status-experimental .status-dot {
  @apply bg-yellow-500;
}

.status-active {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400;
}

.status-active .status-dot {
  @apply bg-blue-500 animate-pulse;
}

.status-legacy {
  @apply bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400;
}

.status-legacy .status-dot {
  @apply bg-red-500;
}

/* 现代化 Tab 增强效果 */
.tab-glow {
  position: relative;
}

.tab-glow::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  padding: 2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab-glow:hover::after {
  opacity: 0.5;
}

/* 动态渐变背景 */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.gradient-animated {
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #06b6d4);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}

/* Tab 内容淡入效果 */
@keyframes tabContentFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

[role="tabpanel"]>* {
  animation: tabContentFadeIn 0.5s ease-out;
}

/* 图标旋转动画 */
@keyframes iconSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.icon-spin {
  animation: iconSpin 2s linear infinite;
}

/* Tab 标签页容器阴影增强 */
[role="tablist"] {
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1));
}

/* 选中状态的脉冲效果 */
@keyframes pulse-glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }

  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4);
  }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 响应式 */
@media (max-width: 1024px) {
  .skills-progress {
    @apply lg:grid-cols-3;
  }
}

@media (max-width: 768px) {
  .hero-title {
    @apply text-3xl;
  }

  .skills-progress {
    @apply grid-cols-2 gap-4;
  }

  .skill-item {
    @apply p-4;
  }

  .project-grid {
    @apply grid-cols-1 gap-3;
  }

  .section {
    @apply py-8;
  }

  .container {
    @apply px-4;
  }

  .section-header {
    @apply mb-6;
  }
}

@media (max-width: 480px) {
  .skills-progress {
    @apply grid-cols-1 gap-4;
  }
}

/* 循环动画定义 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes bounce-gentle {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-4px);
  }
}

@keyframes sway {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(1deg);
  }

  75% {
    transform: rotate(-1deg);
  }
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }

  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(147, 51, 234, 0.3);
  }
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes rotate-subtle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    filter: hue-rotate(0deg) brightness(1);
  }

  25% {
    filter: hue-rotate(90deg) brightness(1.1);
  }

  50% {
    filter: hue-rotate(180deg) brightness(1.2);
  }

  75% {
    filter: hue-rotate(270deg) brightness(1.1);
  }

  100% {
    filter: hue-rotate(360deg) brightness(1);
  }
}

/* 动画类 */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2.5s ease-in-out infinite;
}

.animate-sway {
  animation: sway 4s ease-in-out infinite;
}

.animate-heartbeat {
  animation: heartbeat 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

.animate-rotate-subtle {
  animation: rotate-subtle 20s linear infinite;
}

.animate-shimmer {
  animation: shimmer 4s ease-in-out infinite;
}
</style>
