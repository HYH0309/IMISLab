<script setup lang="ts">
import {
  UserIcon,
  EnvelopeIcon,
  CodeBracketIcon,
  CommandLineIcon,
  PlayIcon,
  BookOpenIcon,
  CpuChipIcon,
  AcademicCapIcon,
  HeartIcon,
  MapPinIcon,
  LinkIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'

onMounted(() => {
  // 页面加载动画
  const cards = document.querySelectorAll('.animate-card')
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in')
    }, index * 100)
  })
})
</script>

<template>
  <div class="about-container">
    <!-- 简化的英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- 头像 -->
        <div class="hero-avatar">
          <div class="avatar-wrapper">
            <UserIcon class="w-16 h-16 text-white" />
          </div>
        </div>

        <!-- 标题和副标题 -->
        <h1 class="hero-title">华农 IMIS 在读程序员</h1>
        <p class="hero-subtitle">正在学习现代Web开发 · 努力成为更好的开发者</p>

        <!-- 状态徽章 -->
        <div class="hero-badges">
          <div class="badge">
            <div class="status-dot"></div>
            <span>持续学习中</span>
          </div>
          <div class="badge">
            <EnvelopeIcon class="w-4 h-4" />
            <span>Y2433936387@163.com</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈区域 -->
    <section class="tech-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <CpuChipIcon class="w-8 h-8 inline-block mr-3 text-blue-600" />
            技术栈
          </h2>
          <p class="section-subtitle">正在学习和使用的技术</p>
        </div>

        <div class="tech-grid">
          <div class="tech-card animate-card">
            <div class="tech-icon vue">
              <CodeBracketIcon class="w-8 h-8" />
            </div>
            <h3 class="tech-name">Vue 3</h3>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 75%"></div>
              </div>
              <span class="progress-text">75%</span>
            </div>
            <span class="tech-status learning">熟练</span>
          </div>

          <div class="tech-card animate-card">
            <div class="tech-icon typescript">
              <CommandLineIcon class="w-8 h-8" />
            </div>
            <h3 class="tech-name">TypeScript</h3>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 60%"></div>
              </div>
              <span class="progress-text">60%</span>
            </div>
            <span class="tech-status progress">进步中</span>
          </div>

          <div class="tech-card animate-card">
            <div class="tech-icon java">
              <PlayIcon class="w-8 h-8" />
            </div>
            <h3 class="tech-name">Java</h3>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 50%"></div>
              </div>
              <span class="progress-text">50%</span>
            </div>
            <span class="tech-status basic">基础</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目展示区域 -->
    <section class="projects-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <RocketLaunchIcon class="w-8 h-8 inline-block mr-3 text-purple-600" />
            学习项目
          </h2>
          <p class="section-subtitle">在学习过程中完成的一些作品</p>
        </div>

        <div class="projects-grid">
          <div class="project-card animate-card">
            <div class="project-header">
              <div class="project-icon">
                <BookOpenIcon class="w-8 h-8" />
              </div>
              <h3 class="project-title">学生管理系统</h3>
            </div>
            <p class="project-description">
              使用Vue3 + TypeScript + Spring Boot构建的学习项目，实现了基本的CRUD功能。
            </p>
            <div class="project-tags">
              <span class="tag vue">Vue 3</span>
              <span class="tag spring">Spring Boot</span>
              <span class="tag learning">学习项目</span>
            </div>
          </div>

          <div class="project-card animate-card">
            <div class="project-header">
              <div class="project-icon">
                <CodeBracketIcon class="w-8 h-8" />
              </div>
              <h3 class="project-title">在线编程平台</h3>
            </div>
            <p class="project-description">
              正在开发的小型OJ平台，用于练习算法题，支持多语言代码评判。
            </p>
            <div class="project-tags">
              <span class="tag developing">开发中</span>
              <span class="tag algorithm">算法</span>
              <span class="tag feature">多语言</span>
            </div>
          </div>

          <div class="project-card animate-card">
            <div class="project-header">
              <div class="project-icon">
                <AcademicCapIcon class="w-8 h-8" />
              </div>
              <h3 class="project-title">技术博客</h3>
            </div>
            <p class="project-description">
              记录学习过程中的心得体会，分享技术发现和成长感悟。
            </p>
            <div class="project-tags">
              <span class="tag sharing">知识分享</span>
              <span class="tag blog">博客</span>
              <span class="tag growth">成长记录</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人介绍区域 -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <div class="section-header">
              <h2 class="section-title">
                <HeartIcon class="w-8 h-8 inline-block mr-3 text-red-500" />
                关于我
              </h2>
              <p class="section-subtitle">一个在华农学习成长的程序员</p>
            </div>

            <div class="intro-text">
              <p class="intro-paragraph">
                嗨！我是一名正在华南农业大学学习的学生，对Web开发特别感兴趣。
                虽然技术水平还在不断提升中，但我很享受编程带来的乐趣。
              </p>
              <p class="intro-paragraph">
                希望通过不断的学习和实践，能够成为一名优秀的开发者。
                平时喜欢折腾各种新技术，也乐于分享学习心得。
              </p>
            </div>

            <!-- 技能标签 -->
            <div class="skills-section">
              <h3 class="skills-title">技能标签</h3>
              <div class="skills-tags">
                <span class="skill-tag learning">Vue.js 学习中</span>
                <span class="skill-tag progress">TypeScript 进步中</span>
                <span class="skill-tag familiar">Java 基础掌握</span>
                <span class="skill-tag interested">Node.js 很感兴趣</span>
                <span class="skill-tag exploring">Python 在探索</span>
              </div>
            </div>
          </div>

          <!-- 头像区域 -->
          <div class="about-avatar">
            <div class="avatar-container">
              <div class="avatar-bg">
                <UserIcon class="w-24 h-24 text-blue-600" />
              </div>
              <div class="avatar-info">
                <h3 class="avatar-name">在校学生</h3>
                <p class="avatar-role">前端开发爱好者</p>
                <div class="avatar-status">
                  <div class="status-indicator"></div>
                  <span>持续学习中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系方式区域 -->
    <section class="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <EnvelopeIcon class="w-8 h-8 inline-block mr-3 text-green-600" />
            联系方式
          </h2>
          <p class="section-subtitle">欢迎交流学习，一起进步</p>
        </div>

        <div class="contact-grid">
          <div class="contact-card animate-card">
            <div class="contact-icon email">
              <EnvelopeIcon class="w-8 h-8" />
            </div>
            <h3 class="contact-title">邮箱</h3>
            <p class="contact-info">Y2433936387@163.com</p>
            <p class="contact-note">欢迎技术交流</p>
          </div>

          <div class="contact-card animate-card">
            <div class="contact-icon github">
              <LinkIcon class="w-8 h-8" />
            </div>
            <h3 class="contact-title">GitHub</h3>
            <p class="contact-info">github.com/HYH0309</p>
            <p class="contact-note">查看项目代码</p>
          </div>

          <div class="contact-card animate-card">
            <div class="contact-icon location">
              <MapPinIcon class="w-8 h-8" />
            </div>
            <h3 class="contact-title">位置</h3>
            <p class="contact-info">华南农业大学</p>
            <p class="contact-note">广州市天河区</p>
          </div>
        </div>

        <!-- 学习邀请 -->
        <div class="learning-invitation">
          <div class="invitation-content">
            <SparklesIcon class="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 class="invitation-title">一起学习吧！</h3>
            <p class="invitation-text">
              如果你也在学习Web开发，或者对技术分享感兴趣，欢迎联系我！
              我们可以一起讨论技术问题，分享学习心得，互相监督进步。
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 基础容器 */
.about-container {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

/* 英雄区域 */
.hero-section {
  @apply relative min-h-[70vh] flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600;
  @apply overflow-hidden;
}

.hero-content {
  @apply relative z-10 text-center text-white max-w-4xl mx-auto px-6;
}

.hero-avatar {
  @apply flex justify-center mb-8;
}

.avatar-wrapper {
  @apply w-24 h-24 rounded-full;
  @apply bg-white/20 backdrop-blur-sm border-4 border-white/30;
  @apply flex items-center justify-center;
  @apply transition-all duration-300 hover:scale-110;
}

.hero-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold mb-6;
  @apply bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent;
}

.hero-subtitle {
  @apply text-lg md:text-xl mb-8 opacity-90 leading-relaxed;
}

.hero-badges {
  @apply flex flex-wrap justify-center gap-4 mb-8;
}

.badge {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium;
  @apply bg-white/10 backdrop-blur-sm border border-white/20;
  @apply transition-all duration-300 hover:scale-105 hover:bg-white/20;
}

.status-dot {
  @apply w-2 h-2 bg-green-400 rounded-full animate-pulse;
}

/* 通用section样式 */
.container {
  @apply max-w-6xl mx-auto px-6;
}

.section-header {
  @apply text-center mb-16;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold mb-4;
  @apply text-gray-900 dark:text-white;
  @apply flex items-center justify-center gap-3;
}

.section-subtitle {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

/* 技术栈区域 */
.tech-section {
  @apply py-20 bg-white dark:bg-gray-800;
}

.tech-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.tech-card {
  @apply bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-2;
  @apply opacity-0 transform translate-y-8;
}

.tech-card.animate-in {
  @apply opacity-100 translate-y-0;
  transition: all 0.6s ease-out;
}

.tech-icon {
  @apply w-16 h-16 rounded-2xl mx-auto mb-6;
  @apply flex items-center justify-center;
  @apply transition-transform duration-300 hover:scale-110;
}

.tech-icon.vue {
  @apply bg-gradient-to-r from-green-400 to-green-600 text-white;
}

.tech-icon.typescript {
  @apply bg-gradient-to-r from-blue-500 to-blue-700 text-white;
}

.tech-icon.java {
  @apply bg-gradient-to-r from-orange-500 to-red-600 text-white;
}

.tech-name {
  @apply text-xl font-bold text-center mb-4;
  @apply text-gray-900 dark:text-white;
}

.progress-container {
  @apply flex items-center gap-3 mb-4;
}

.progress-bar {
  @apply flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full;
  @apply transition-all duration-1000 ease-out;
}

.progress-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

.tech-status {
  @apply text-center px-3 py-1 rounded-full text-sm font-medium;
}

.tech-status.learning {
  @apply bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300;
}

.tech-status.progress {
  @apply bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300;
}

.tech-status.basic {
  @apply bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300;
}

/* 项目区域 */
.projects-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800/50;
}

.projects-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.project-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-2;
  @apply opacity-0 transform translate-y-8;
}

.project-card.animate-in {
  @apply opacity-100 translate-y-0;
  transition: all 0.6s ease-out;
}

.project-header {
  @apply flex items-center gap-4 mb-6;
}

.project-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
  @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white;
}

.project-title {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.project-description {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed mb-6;
}

.project-tags {
  @apply flex flex-wrap gap-2;
}

.tag {
  @apply px-3 py-1 text-xs font-medium rounded-full;
}

.tag.vue {
  @apply bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300;
}

.tag.spring {
  @apply bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300;
}

.tag.learning {
  @apply bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300;
}

.tag.developing {
  @apply bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300;
}

.tag.algorithm {
  @apply bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300;
}

.tag.feature {
  @apply bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300;
}

.tag.sharing {
  @apply bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300;
}

.tag.blog {
  @apply bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300;
}

.tag.growth {
  @apply bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300;
}

/* 关于我区域 */
.about-section {
  @apply py-20 bg-white dark:bg-gray-800;
}

.about-content {
  @apply grid lg:grid-cols-2 gap-12 items-center;
}

.intro-text {
  @apply space-y-6;
}

.intro-paragraph {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

.skills-section {
  @apply mt-8;
}

.skills-title {
  @apply text-xl font-bold mb-4 text-gray-900 dark:text-white;
}

.skills-tags {
  @apply flex flex-wrap gap-3;
}

.skill-tag {
  @apply px-3 py-1 text-sm font-medium rounded-full;
  @apply transition-all duration-300 hover:scale-105;
}

.skill-tag.learning {
  @apply bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300;
}

.skill-tag.progress {
  @apply bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300;
}

.skill-tag.familiar {
  @apply bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300;
}

.skill-tag.interested {
  @apply bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300;
}

.skill-tag.exploring {
  @apply bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300;
}

.about-avatar {
  @apply flex justify-center lg:justify-end;
}

.avatar-container {
  @apply text-center;
}

.avatar-bg {
  @apply w-32 h-32 rounded-full mx-auto mb-6;
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
  @apply flex items-center justify-center;
  @apply transition-transform duration-300 hover:scale-110;
}

.avatar-info {
  @apply space-y-2;
}

.avatar-name {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.avatar-role {
  @apply text-blue-600 dark:text-blue-400 font-medium;
}

.avatar-status {
  @apply flex items-center justify-center gap-2 text-sm;
  @apply text-gray-600 dark:text-gray-400;
}

.status-indicator {
  @apply w-2 h-2 bg-green-500 rounded-full animate-pulse;
}

/* 联系方式区域 */
.contact-section {
  @apply py-20 bg-gray-50 dark:bg-gray-800/50;
}

.contact-grid {
  @apply grid md:grid-cols-3 gap-8 mb-16;
}

.contact-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-2;
  @apply opacity-0 transform translate-y-8;
}

.contact-card.animate-in {
  @apply opacity-100 translate-y-0;
  transition: all 0.6s ease-out;
}

.contact-icon {
  @apply w-16 h-16 rounded-2xl mx-auto mb-6;
  @apply flex items-center justify-center;
  @apply transition-transform duration-300 hover:scale-110;
}

.contact-icon.email {
  @apply bg-gradient-to-r from-green-500 to-green-600 text-white;
}

.contact-icon.github {
  @apply bg-gradient-to-r from-gray-700 to-gray-900 text-white;
}

.contact-icon.location {
  @apply bg-gradient-to-r from-red-500 to-pink-600 text-white;
}

.contact-title {
  @apply text-xl font-bold mb-2 text-gray-900 dark:text-white;
}

.contact-info {
  @apply text-gray-600 dark:text-gray-400 font-medium mb-2;
}

.contact-note {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* 学习邀请区域 */
.learning-invitation {
  @apply bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20;
  @apply rounded-2xl p-8 text-center;
  @apply border border-blue-200 dark:border-blue-700;
}

.invitation-content {
  @apply max-w-2xl mx-auto;
}

.invitation-title {
  @apply text-2xl font-bold mb-4 text-gray-900 dark:text-white;
}

.invitation-text {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

/* 动画效果 */
.animate-card {
  @apply opacity-0 transform translate-y-8;
}

.animate-card.animate-in {
  @apply opacity-100 translate-y-0;
  transition: all 0.6s ease-out;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .hero-title {
    @apply text-3xl;
  }

  .section-title {
    @apply text-2xl flex-col gap-2;
  }

  .tech-grid,
  .projects-grid,
  .contact-grid {
    @apply grid-cols-1;
  }

  .about-content {
    @apply grid-cols-1 text-center;
  }
}
</style>
