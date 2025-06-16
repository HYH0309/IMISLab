import { test, expect } from '@playwright/test'

// E2E测试 - Vue管理系统
test('visits the app root url', async ({ page }) => {
  await page.goto('/')

  // 验证首页画廊界面加载正常
  await expect(page.locator('h2').first()).toBeVisible()

  // 验证导航栏存在
  await expect(page.locator('nav')).toBeVisible()

  // 验证主题切换按钮存在（使用aria-label）
  await expect(page.locator('button[aria-label="Toggle theme"]')).toBeVisible()
})

// 测试管理页面访问
test('can access admin page', async ({ page }) => {
  await page.goto('/admin')

  // 验证管理页面标题
  await expect(page.locator('h1')).toContainText('管理后台')

  // 验证统计卡片区域存在
  await expect(page.locator('[role="main"]')).toBeVisible()
})

// 测试文章列表页面
test('can access article list', async ({ page }) => {
  await page.goto('/article-list')

  // 验证页面内容加载（搜索框）
  await expect(page.locator('input[placeholder*="搜索文章"]')).toBeVisible()
})

// 测试OJ列表页面
test('can access oj list', async ({ page }) => {
  await page.goto('/oj-list')

  // 验证页面内容加载（搜索框或题目链接）
  await expect(
    page.locator('input[placeholder*="搜索题目"], a[href*="/oj/"]').first(),
  ).toBeVisible()
})

// 测试可视化页面
test('can access visualizer', async ({ page }) => {
  await page.goto('/visualizer')

  // 验证页面内容加载
  await expect(page.locator('body')).toBeVisible()
})
