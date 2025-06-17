<template>
  <div class="about-container">
    <!-- 头部英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-overlay"></div>
        <div class="floating-elements">
          <div class="element element-1"></div>
          <div class="element element-2"></div>
          <div class="element element-3"></div>
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            👨‍💻 华农 IMIS 在读程序员
          </h1>
          <p class="hero-subtitle">
            正在学习现代Web开发 · 偶尔写写有趣的小项目 · 努力成为更好的开发者
          </p>
          <div class="hero-badges">
            <div class="badge badge-learning">
              <span class="badge-icon">📚</span>
              <span>持续学习中</span>
            </div>
            <div class="badge badge-email">
              <span class="badge-icon">📧</span>
              <span>联系邮箱: Y2433936387@163.com</span>
            </div>
          </div>
          <div class="hero-quote">
            "在华农的日子里，代码和生活都在慢慢变好" —— 一个正在成长的开发者
          </div>
          <div class="learning-stack">
            <h3 class="learning-title">🚀 正在学习的技术</h3>
            <div class="tech-grid">
              <div class="tech-item">
                <div class="tech-icon go">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.082l-.199.303c-.023.047-.082.07-.117.07H1.811zm-.105 2.64c-.047 0-.058-.024-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.675c.047 0 .059.035.035.082l-.199.303c-.023.047-.081.07-.117.07H1.706zm-.211-1.32c-.047 0-.058-.024-.035-.059l.246-.315c.024-.035.082-.058.129-.058h5.297c.047 0 .058.035.035.082l-.199.303c-.024.047-.082.07-.117.07H1.495zM8.851 13.923c-.47.024-.892-.106-1.052-.347-.16-.24-.046-.569.258-.762.304-.193.793-.24 1.263-.12.47.12.892.347 1.052.586.16.24.047.57-.257.763-.304.193-.793.24-1.264.121-.047-.012-.07-.035-.07-.082v-.159c0-.047.024-.07.07-.082.399-.095.751-.2.751-.347s-.352-.252-.751-.347c-.399-.095-.751.2-.751.347s.352.252.751.347c.047.012.07.035.07.082v.159c0 .047-.023.07-.07.082z"/>
                  </svg>
                </div>
                <span class="tech-name">Go</span>
                <span class="tech-status learning">学习中</span>
              </div>

              <div class="tech-item">
                <div class="tech-icon rust">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.5814l-1.0541-.2725a13.9951 13.9951 0 00-.0836-.2859l.7093-.9327a.348.348 0 00-.2257-.5419l-1.0541-.0735a14.2953 14.2953 0 00-.1365-.2695l.5363-1.0209a.3479.3479 0 00-.3270-.4906l-1.0073.1433a14.5748 14.5748 0 00-.1835-.2373l.3270-.9327a.3477.3477 0 00-.4160-.4279l-.9541.4279a14.6422 14.6422 0 00-.2259-.1433l.1154-.9327a.3475.3475 0 00-.5419-.3745l-.8069.7093a14.4542 14.4542 0 00-.2725-.1154l-.1433-.9327a.3472.3472 0 00-.5814-.2725l-.6236 1.0073a14.2953 14.2953 0 00-.2859.0283l-.8069-.8656a.3485.3485 0 00-.5814.1154l-.2725 1.0541a13.9951 13.9951 0 00-.2859.0836l-.9327-.7093a.348.348 0 00-.5419.2257l-.0735 1.0541a14.2953 14.2953 0 00-.2695.1365l-1.0209-.5363a.3479.3479 0 00-.4906.3270l.1433 1.0073a14.5748 14.5748 0 00-.2373.1835l-.9327-.3270a.3477.3477 0 00-.4279.4160l.4279.9541a14.6422 14.6422 0 00-.1433.2259l-.9327-.1154a.3475.3475 0 00-.3745.5419l.7093.8069a14.4542 14.4542 0 00-.1154.2725l-.9327.1433a.3472.3472 0 00-.2725.5814l1.0073.6236a14.2953 14.2953 0 00.0283.2859l-.8656.8069a.3485.3485 0 00.1154.5814l1.0541.2725a13.9951 13.9951 0 00.0836.2859l-.7093.9327a.348.348 0 00.2257.5419l1.0541.0735a14.2953 14.2953 0 00.1365.2695l-.5363 1.0209a.3479.3479 0 00.3270.4906l1.0073-.1433a14.5748 14.5748 0 00.1835.2373l-.3270.9327a.3477.3477 0 00.4160.4279l.9541-.4279a14.6422 14.6422 0 00.2259.1433l-.1154.9327a.3475.3475 0 00.5419.3745l.8069-.7093a14.4542 14.4542 0 00.2725.1154l.1433.9327a.3472.3472 0 00.5814.2725l.6236-1.0073a14.2953 14.2953 0 00.2859-.0283l.8069.8656a.3485.3485 0 00.5814-.1154l.2725-1.0541a13.9951 13.9951 0 00.2859-.0836l.9327.7093a.348.348 0 00.5419-.2257l.0735-1.0541a14.2953 14.2953 0 00.2695-.1365l1.0209.5363a.3479.3479 0 00.4906-.3270l-.1433-1.0073a14.5748 14.5748 0 00.2373-.1835l.9327.3270a.3477.3477 0 00.4279-.4160l-.4279-.9541a14.6422 14.6422 0 00.1433-.2259l.9327.1154a.3475.3475 0 00.3745-.5419l-.7093-.8069a14.4542 14.4542 0 00.1154-.2725l.9327-.1433a.3472.3472 0 00.2725-.5814z"/>
                  </svg>
                </div>
                <span class="tech-name">Rust</span>
                <span class="tech-status exploring">探索中</span>
              </div>

              <div class="tech-item">
                <div class="tech-icon redis">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.5 2.661l.54.997-1.797.644-.54-.997L10.5 2.661zm2.077.702l2.132.781-.54.997-2.132-.781.54-.997zm3.533 1.298l1.797.644-.54.997-1.797-.644.54-.997zM6.174 6.135l.54-.997 1.797.644-.54.997-1.797-.644zm4.61 1.686l2.132.781-.54.997-2.132-.781.54-.997zm5.33 1.955l.54-.997 1.797.644-.54.997-1.797-.644zm-12.52 1.955l.54-.997 1.797.644-.54.997-1.797-.644zm4.61 1.686l2.132.781-.54.997-2.132-.781.54-.997zm3.533 1.298l1.797.644-.54.997-1.797-.644.54-.997zm-8.613 1.955l.54-.997 1.797.644-.54.997-1.797-.644z"/>
                  </svg>
                </div>
                <span class="tech-name">Redis</span>
                <span class="tech-status interested">感兴趣</span>
              </div>

              <div class="tech-item">
                <div class="tech-icon typescript">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                  </svg>
                </div>
                <span class="tech-name">TypeScript</span>
                <span class="tech-status progress">进步中</span>
              </div>

              <div class="tech-item">
                <div class="tech-icon vue">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/>
                  </svg>
                </div>
                <span class="tech-name">Vue 3</span>
                <span class="tech-status familiar">熟悉中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 项目介绍 -->
      <section class="section project-intro">
        <div class="container">          <div class="section-header">
            <h2 class="section-title">🛠️ 我的技术工具箱</h2>
            <p class="section-subtitle">正在使用和学习的技术栈</p>
          </div>

          <div class="intro-grid">
            <div class="intro-text">
              <h3 class="intro-heading">学习心得</h3>
              <p class="intro-description">
                作为一名在校学生，我正在努力学习现代Web开发技术。
                每天都在进步，虽然偶尔会遇到一些挑战，但这正是成长的过程。
                希望通过不断的实践和学习，能够创造出更好的作品。
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>持续学习新技术</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>实践中成长</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>分享学习经验</span>
                </div>
              </div>
            </div>

            <div class="intro-visual">
              <div class="visual-card">
                <div class="card-header">
                  <div class="card-dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                  </div>
                  <span class="card-title">技术栈学习进度</span>
                </div>
                <div class="card-content">
                  <div class="tech-stack">
                    <div class="tech-item tech-learning">Java 在学习中</div>
                    <div class="tech-item tech-learning">Python 基础掌握</div>
                    <div class="tech-item tech-progress">Vue3 进步明显</div>
                    <div class="tech-item tech-progress">TypeScript 持续改进</div>
                    <div class="tech-item tech-familiar">Spring Boot 在熟悉</div>
                    <div class="tech-item tech-familiar">MySQL 正在深入</div>
                  </div>
                  <div class="learning-stats">
                    <div class="learning-item">
                      <span class="learning-label">学习重点:</span>
                      <span class="learning-value">前端框架与交互设计</span>
                    </div>
                    <div class="learning-item">
                      <span class="learning-label">下一步计划:</span>
                      <span class="learning-value">后端开发与数据库设计</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特色 -->
      <section class="section features">
        <div class="container">          <div class="section-header">
            <h2 class="section-title">📚 我的学习项目</h2>
            <p class="section-subtitle">在学习过程中完成的一些小作品</p>
          </div>

          <div class="features-grid">
            <div class="feature-card project-card">
              <div class="feature-icon-container project-icon">
                <svg class="feature-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="feature-card-title">📖 学生管理系统</h3>
              <p class="feature-card-description">
                一个用于练习的小项目，使用Vue3 + TypeScript + Spring Boot构建，
                虽然还有很多需要改进的地方，但已经基本实现了CRUD功能。
              </p>
              <div class="project-badges">
                <span class="badge badge-learning">学习项目</span>
                <span class="badge badge-progress">持续优化中</span>
              </div>
            </div>

            <div class="feature-card project-card">
              <div class="feature-icon-container project-icon algorithms">
                <svg class="feature-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="feature-card-title">💻 在线编程平台</h3>
              <p class="feature-card-description">
                正在开发的一个小型OJ平台，主要用来练习算法题。
                界面还在不断改进中，希望能够帮助同学们更好地学习编程。
              </p>
              <div class="project-badges">
                <span class="badge badge-developing">开发中</span>
                <span class="badge badge-feature">多语言支持</span>
              </div>
            </div>

            <div class="feature-card project-card">
              <div class="feature-icon-container project-icon campus">
                <svg class="feature-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="feature-card-title">🌟 技术博客</h3>
              <p class="feature-card-description">
                记录学习过程中的心得体会，分享一些有趣的技术发现。
                虽然文章不多，但每一篇都是认真思考后的总结。
              </p>
              <div class="project-badges">
                <span class="badge badge-sharing">知识分享</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 团队介绍 -->
      <section class="section team">
        <div class="container">          <div class="section-header">
            <h2 class="section-title">👋 关于我</h2>
            <p class="section-subtitle">一个在华农学习成长的程序员</p>
          </div>

          <div class="team-card">
            <div class="team-info">
              <div class="team-avatar">
                <div class="avatar-placeholder student">
                  <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="team-details">
                <h3 class="team-name">在校学生 • 前端爱好者</h3>
                <p class="team-role">华南农业大学 IMIS 专业在读</p>
                <p class="team-description">
                  嗨！我是一名正在华农学习的学生，对Web开发特别感兴趣。
                  虽然技术水平还在不断提升中，但我很享受编程带来的乐趣。
                  希望通过不断的学习和实践，能够成为一名优秀的开发者。
                  平时喜欢折腾各种新技术，也乐于分享学习心得。
                </p>
                <div class="team-skills">
                  <span class="skill-tag learning">Vue.js 学习中</span>
                  <span class="skill-tag progress">TypeScript 进步中</span>
                  <span class="skill-tag familiar">Java 基础掌握</span>
                  <span class="skill-tag interested">Node.js 很感兴趣</span>
                  <span class="skill-tag exploring">Python 在探索</span>
                  <span class="skill-tag planning">React 计划学习</span>
                </div>

                <div class="campus-life">
                  <h4 class="life-title">🏫 我的校园生活</h4>
                  <div class="life-list">
                    <div class="life-moment">
                      <span class="moment-icon">🌳</span>
                      <span>在树木园找个安静角落写代码</span>
                    </div>
                    <div class="life-moment">
                      <span class="moment-icon">🚌</span>
                      <span>校巴上看技术文章和视频</span>
                    </div>
                    <div class="life-moment">
                      <span class="moment-icon">🥭</span>
                      <span>芷园的美食是编程路上的能量补给</span>
                    </div>
                    <div class="life-moment">
                      <span class="moment-icon">🌉</span>
                      <span>紫荆桥上思考项目架构</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="section contact">
        <div class="container">          <div class="section-header">
            <h2 class="section-title">📬 联系方式</h2>
            <p class="section-subtitle">欢迎交流学习，一起进步</p>
          </div>

          <div class="contact-grid">
            <div class="contact-item">
              <div class="contact-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="contact-title">📧 邮箱联系</h3>
              <p class="contact-info">Y2433936387@163.com</p>
              <p class="contact-note">欢迎技术交流和学习讨论</p>
            </div>

            <div class="contact-item">
              <div class="contact-icon github">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <h3 class="contact-title">💻 GitHub</h3>
              <p class="contact-info">github.com/HYH0309</p>
              <p class="contact-note">查看我的学习项目和代码</p>
            </div>

            <div class="contact-item">
              <div class="contact-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="contact-title">🏫 位置</h3>
              <p class="contact-info">华南农业大学</p>
              <p class="contact-note">广州市天河区，欢迎面基交流</p>
            </div>
          </div>

          <div class="learning-invitation">
            <h4 class="invitation-title">🤝 一起学习吧！</h4>
            <p class="invitation-description">
              如果你也在学习Web开发，或者对技术分享感兴趣，欢迎联系我！
              我们可以一起讨论技术问题，分享学习心得，互相监督进步。
              虽然我还在学习阶段，但相信通过交流能让我们都变得更好。
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 页面加载时可以添加一些动画效果
})
</script>

<style scoped>
.about-container {
  @apply min-h-screen bg-white dark:bg-gray-900;
}

/* 英雄区域 */
.hero-section {
  @apply relative min-h-[60vh] flex items-center justify-center overflow-hidden;
  @apply bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600;
}

.hero-background {
  @apply absolute inset-0;
}

.gradient-overlay {
  @apply absolute inset-0 bg-black/20;
}

.floating-elements {
  @apply absolute inset-0;
}

.element {
  @apply absolute rounded-full opacity-20;
  animation: heroFloat 8s ease-in-out infinite;
}

.element-1 {
  @apply w-32 h-32 bg-white top-20 left-20;
  animation-delay: 0s;
}

.element-2 {
  @apply w-24 h-24 bg-yellow-300 top-40 right-32;
  animation-delay: 2s;
}

.element-3 {
  @apply w-40 h-40 bg-pink-300 bottom-20 left-1/3;
  animation-delay: 4s;
}

@keyframes heroFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.hero-content {
  @apply relative z-10 text-center text-white max-w-4xl mx-auto px-6;
}

.hero-title {
  @apply text-5xl md:text-6xl font-bold mb-6;
  @apply bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent;
}

.hero-subtitle {
  @apply text-xl md:text-2xl mb-12 opacity-90;
}

.hero-badges {
  @apply flex flex-wrap justify-center gap-4 mb-8;
}

.badge {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium;
}

.badge-learning {
  @apply bg-blue-500/20 text-blue-200 border border-blue-400/30;
}

.badge-progress {
  @apply bg-green-500/20 text-green-200 border border-green-400/30;
}

.badge-developing {
  @apply bg-orange-500/20 text-orange-200 border border-orange-400/30;
}

.badge-feature {
  @apply bg-purple-500/20 text-purple-200 border border-purple-400/30;
}

.badge-email {
  @apply bg-blue-500/20 text-blue-200 border border-blue-400/30;
}

.badge-learning {
  @apply bg-green-500/20 text-green-200 border border-green-400/30;
}

.hero-quote {
  @apply text-lg italic opacity-90 mb-8 px-6 py-4;
  @apply bg-white/10 rounded-lg border border-white/20;
}

/* 主要内容 */
.main-content {
  @apply relative;
}

.section {
  @apply py-20;
}

.container {
  @apply max-w-6xl mx-auto px-6;
}

.section-header {
  @apply text-center mb-16;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold mb-4;
  @apply text-gray-900 dark:text-white;
}

.section-subtitle {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

/* 项目介绍 */
.project-intro {
  @apply bg-gray-50 dark:bg-gray-800/50;
}

.intro-grid {
  @apply grid md:grid-cols-2 gap-12 items-center;
}

.intro-heading {
  @apply text-2xl font-bold mb-4 text-gray-900 dark:text-white;
}

.intro-description {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed mb-8;
}

.features-list {
  @apply space-y-4;
}

.feature-item {
  @apply flex items-center gap-3;
}

.feature-icon {
  @apply w-6 h-6 text-blue-600 dark:text-blue-400;
}

.visual-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden;
}

.card-header {
  @apply flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700;
}

.card-dots {
  @apply flex gap-2;
}

.dot {
  @apply w-3 h-3 rounded-full;
}

.dot-red {
  @apply bg-red-500;
}

.dot-yellow {
  @apply bg-yellow-500;
}

.dot-green {
  @apply bg-green-500;
}

.card-title {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

.card-content {
  @apply p-6;
}

.tech-stack {
  @apply grid grid-cols-2 gap-3;
}

.tech-item {
  @apply text-center py-3 px-4 bg-blue-50 dark:bg-blue-900/30;
  @apply text-blue-700 dark:text-blue-300 rounded-lg font-medium;
}

/* 技术栈学习样式 */
.tech-learning {
  @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply border border-blue-200 dark:border-blue-700;
}

.tech-progress {
  @apply bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300;
  @apply border border-green-200 dark:border-green-700;
}

.tech-familiar {
  @apply bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300;
  @apply border border-orange-200 dark:border-orange-700;
}

.learning-stats {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.learning-item {
  @apply flex justify-between items-center py-1 text-xs;
}

.learning-label {
  @apply text-gray-600 dark:text-gray-400;
}

.learning-value {
  @apply font-medium text-gray-800 dark:text-gray-200;
}

/* 功能特色 */
.features-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.feature-card {
  @apply text-center p-8 bg-white dark:bg-gray-800;
  @apply rounded-2xl shadow-lg hover:shadow-xl;
  @apply transition-all duration-300 transform hover:-translate-y-2;
}

.feature-icon-container {
  @apply inline-flex items-center justify-center w-16 h-16 mb-6;
  @apply bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.feature-card-icon {
  @apply w-8 h-8 text-white;
}

.feature-card-title {
  @apply text-xl font-bold mb-4 text-gray-900 dark:text-white;
}

.feature-card-description {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

/* 项目卡片特殊样式 */
.project-card {
  @apply relative overflow-hidden;
}

.project-card::before {
  content: '';
  @apply absolute top-0 left-0 w-2 h-full;
}

.project-card:nth-child(1)::before {
  @apply bg-gradient-to-b from-green-500 to-blue-500;
}

.project-card:nth-child(2)::before {
  @apply bg-gradient-to-b from-blue-500 to-purple-500;
}

.project-card:nth-child(3)::before {
  @apply bg-gradient-to-b from-purple-500 to-pink-500;
}

.project-badges {
  @apply flex flex-wrap gap-2 mt-4;
}

.project-icon {
  @apply bg-gradient-to-r from-red-500 to-orange-500;
}

.project-icon.algorithms {
  @apply bg-gradient-to-r from-blue-500 to-purple-500;
}

.project-icon.nuclear {
  @apply bg-gradient-to-r from-orange-500 to-red-600;
}

.project-icon.campus {
  @apply bg-gradient-to-r from-green-500 to-blue-500;
}

/* 团队样式增强 */
.team {
  @apply bg-gray-50 dark:bg-gray-800/50;
}

.team-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8;
}

.team-info {
  @apply flex flex-col md:flex-row gap-8 items-start;
}

.team-avatar {
  @apply flex-shrink-0;
}

.avatar-placeholder {
  @apply w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500;
  @apply rounded-full flex items-center justify-center;
}

.avatar-icon {
  @apply w-12 h-12 text-white;
}

.team-name {
  @apply text-2xl font-bold mb-2 text-gray-900 dark:text-white;
}

.team-role {
  @apply text-blue-600 dark:text-blue-400 font-medium mb-4;
}

.team-description {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed mb-6;
}

.team-skills {
  @apply flex flex-wrap gap-2;
}

.skill-tag {
  @apply px-3 py-1 bg-blue-100 dark:bg-blue-900/30;
  @apply text-blue-700 dark:text-blue-300 rounded-full text-sm;
}

.skill-tag.danger {
  @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300;
  @apply border border-red-200 dark:border-red-700;
}

.skill-tag.warning {
  @apply bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
  @apply border border-yellow-200 dark:border-yellow-700;
}

.skill-tag.learning {
  @apply bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300;
  @apply border border-green-200 dark:border-green-700;
}

.skill-tag.progress {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply border border-blue-200 dark:border-blue-700;
}

.skill-tag.familiar {
  @apply bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300;
  @apply border border-orange-200 dark:border-orange-700;
}

.skill-tag.interested {
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300;
  @apply border border-purple-200 dark:border-purple-700;
}

.skill-tag.exploring {
  @apply bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
  @apply border border-yellow-200 dark:border-yellow-700;
}

.skill-tag.planning {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply border border-gray-200 dark:border-gray-600;
}

.campus-life {
  @apply mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg;
}

.life-title {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.life-list {
  @apply space-y-3;
}

.life-moment {
  @apply flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300;
}

.moment-icon {
  @apply text-lg;
}

/* 联系方式特殊样式 */
.contact-grid {
  @apply grid md:grid-cols-3 gap-8;
}

.contact-item {
  @apply text-center p-6;
}

.contact-icon {
  @apply inline-flex items-center justify-center w-12 h-12 mb-4;
  @apply bg-blue-100 dark:bg-blue-900/30 rounded-full;
}

.contact-icon svg {
  @apply w-6 h-6 text-blue-600 dark:text-blue-400;
}

.contact-title {
  @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
}

.contact-info {
  @apply text-gray-600 dark:text-gray-400;
}

.contact-icon.github {
  @apply bg-gray-100 dark:bg-gray-700;
}

.contact-icon.github svg {
  @apply text-gray-700 dark:text-gray-300;
}

.contact-note {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.contact-icon.nuclear {
  @apply bg-red-100 dark:bg-red-900/30;
}

.contact-icon.nuclear svg {
  @apply text-red-600 dark:text-red-400;
}

.contact-icon.campus {
  @apply bg-green-100 dark:bg-green-900/30;
}

.contact-icon.campus svg {
  @apply text-green-600 dark:text-green-400;
}

.contact-warning {
  @apply text-xs text-red-500 dark:text-red-400 mt-1 italic;
}

.collaboration-warning {
  @apply mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl;
  @apply border border-red-200 dark:border-red-800;
}

.warning-title {
  @apply text-xl font-bold mb-4 text-red-800 dark:text-red-300;
}

.warning-list {
  @apply space-y-3;
}

.warning-item {
  @apply flex items-center gap-3 text-red-700 dark:text-red-300;
}

.warning-icon {
  @apply text-lg;
}

/* 学习技术栈展示样式 */
.learning-stack {
  @apply bg-white/10 backdrop-blur-sm rounded-2xl p-8;
  @apply border border-white/20;
}

.learning-title {
  @apply text-2xl font-bold text-white text-center mb-6;
}

.tech-grid {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4;
}

.tech-item {
  @apply flex flex-col items-center p-4 rounded-xl;
  @apply bg-white/10 backdrop-blur-sm border border-white/20;
  @apply transition-all duration-300 hover:scale-105 hover:bg-white/20;
  @apply text-center;
}

.tech-icon {
  @apply w-16 h-16 rounded-full mb-3;
  @apply flex items-center justify-center;
  @apply shadow-lg transition-transform duration-300;
}

.tech-icon.go {
  @apply bg-gradient-to-r from-cyan-400 to-blue-500 text-white;
}

.tech-icon.rust {
  @apply bg-gradient-to-r from-orange-400 to-red-500 text-white;
}

.tech-icon.redis {
  @apply bg-gradient-to-r from-red-500 to-red-600 text-white;
}

.tech-icon.typescript {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
}

.tech-icon.vue {
  @apply bg-gradient-to-r from-green-400 to-green-500 text-white;
}

.tech-name {
  @apply text-white font-semibold mb-1;
}

.tech-status {
  @apply text-xs px-2 py-1 rounded-full font-medium;
}

.tech-status.learning {
  @apply bg-blue-500/30 text-blue-200 border border-blue-400/30;
}

.tech-status.exploring {
  @apply bg-orange-500/30 text-orange-200 border border-orange-400/30;
}

.tech-status.interested {
  @apply bg-red-500/30 text-red-200 border border-red-400/30;
}

.tech-status.progress {
  @apply bg-blue-500/30 text-blue-200 border border-blue-400/30;
}

.tech-status.familiar {
  @apply bg-green-500/30 text-green-200 border border-green-400/30;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .hero-stats {
    @apply flex-col gap-6;
  }

  .stat-divider {
    @apply w-12 h-px;
  }

  .intro-grid {
    @apply grid-cols-1;
  }

  .features-grid {
    @apply grid-cols-1;
  }

  .contact-grid {
    @apply grid-cols-1;
  }
}
</style>
