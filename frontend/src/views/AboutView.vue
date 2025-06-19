<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { ref, watch, nextTick } from 'vue'
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

// Tab 指示器动画状态
const selectedTabIndex = ref(0)
const tabIndicatorStyle = ref({
  transform: 'translateX(0px)',
  width: '140px'
})

// 更新指示器位置
const updateIndicator = (index: number) => {
  selectedTabIndex.value = index
  nextTick(() => {
    const tabWidth = 140 + 8 // tab最小宽度 + 间距
    tabIndicatorStyle.value = {
      transform: `translateX(${index * tabWidth}px)`,
      width: '140px'
    }
  })
}
</script>

<template>
  <div class="about-container">
    <!-- 头部英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-avatar">
          <UserIcon class="w-24 h-24 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 class="hero-title">
          👨‍💻 华农 IMIS 在读程序员
        </h1>
        <p class="hero-subtitle">
          正在学习现代Web开发 · 偶尔写写有趣的小项目
        </p>
        <p class="hero-description">
          华南农业大学在读学生，热爱Web开发，享受编程乐趣。
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
            <div class="contact-link location">
              <Icon icon="mdi:map-marker" class="w-5 h-5" />
              <span>华南农业大学</span>
            </div>
          </div>
        </div>
        <div class="hero-badges">
          <div class="badge">
            📚 持续学习中
          </div>
          <div class="badge">
            🎯 追求卓越
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 技能与项目标签页 -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">💻 技能与项目</h2>
            <p class="section-subtitle">技术栈与项目展示</p>
          </div>

          <!-- Headless UI 标签页 -->
          <TabGroup as="div" class="relative" @change="updateIndicator">
            <TabList
              class="relative flex space-x-2 rounded-2xl bg-white/70 dark:bg-gray-800/70 p-2 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30 w-fit mx-auto overflow-hidden">
              <!-- 动态滑动指示器 -->
              <div 
                class="absolute top-2 bottom-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                :style="tabIndicatorStyle">
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-md"></div>
              </div>
              
              <Tab as="template" v-slot="{ selected }">
                <button :class="[
                  'relative z-10 flex items-center gap-2.5 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300 ease-out',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
                  'hover:scale-105 transform-gpu min-w-[140px] justify-center',
                  selected
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/30 dark:hover:bg-gray-700/30',
                ]">
                  <LightBulbIcon :class="[
                    'w-5 h-5 transition-all duration-300',
                    selected ? 'text-white drop-shadow-sm animate-pulse' : 'text-gray-500 dark:text-gray-400'
                  ]" />
                  <span class="font-bold tracking-wide">正在学习</span>
                </button>
              </Tab>
              
              <Tab as="template" v-slot="{ selected }">
                <button :class="[
                  'relative z-10 flex items-center gap-2.5 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300 ease-out',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
                  'hover:scale-105 transform-gpu min-w-[140px] justify-center',
                  selected
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/30 dark:hover:bg-gray-700/30',
                ]">
                  <RocketLaunchIcon :class="[
                    'w-5 h-5 transition-all duration-300',
                    selected ? 'text-white drop-shadow-sm animate-bounce' : 'text-gray-500 dark:text-gray-400'
                  ]" />
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
                <div class="projects-subtitle mb-8">
                  <p class="text-gray-600 dark:text-gray-400 text-center font-medium">一些作品展示</p>
                </div>
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
                      <a href="https://github.com/HYH0309/student-management" target="_blank" class="github-link">
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

.hero-badges {
  @apply flex flex-wrap justify-center gap-4;
}

.badge {
  @apply px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm;
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

.section-subtitle {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

/* 技能学习部分 */
.learning-content {
  @apply space-y-6;
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

[role="tabpanel"] > * {
  animation: tabContentFadeIn 0.5s ease-out;
}

/* 图标旋转动画 */
@keyframes iconSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  0%, 100% {
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
</style>
