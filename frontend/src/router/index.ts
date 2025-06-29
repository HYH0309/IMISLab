import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/GalleryView.vue'),
    meta: { transition: 'fade' },
  },
  {
    path: '/article-list',
    component: () => import('@/views/ArticleListView.vue'),
    meta: { transition: 'slide-left' },
  },
  {
    path: '/article/:id',
    component: () => import('@/views/ArticleView.vue'),
    props: true,
    meta: { transition: 'slide-up' },
  },
  {
    path: '/visualizer',
    component: () => import('@/views/VisualizerView.vue'),
    meta: { transition: 'fade' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { transition: 'fade' },
  },
  // 修改后的OJ路由配置
  {
    path: '/oj-list',
    name: 'OJList',
    component: () => import('@/views/OJListView.vue'),
    meta: { transition: 'slide-left' },
  },
  {
    path: '/oj/:id',
    name: 'OJDetail',
    component: () => import('@/views/OJView.vue'),
    props: true, // 启用路由参数自动注入props
    meta: { transition: 'slide-up' },
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { transition: 'fade' },
    children: [
      {
        path: 'articles',
        component: () => import('@/views/admin/ArticleAdminView.vue'),
        meta: { transition: 'slide-left' },
      },
      {
        path: 'tags',
        component: () => import('@/views/admin/TagAdminView.vue'),
        meta: { transition: 'slide-left' },
      },
      {
        path: 'oj',
        component: () => import('@/views/admin/OJAdminView.vue'),
        meta: { transition: 'slide-left' },
      },
    ],
  },
  {
    path: '/ai-compact-demo',
    name: 'AICompactDemo',
    component: () => import('@/views/AICompactDemo.vue'),
    meta: { transition: 'fade' },
  },
  {
    path: '/ai-comparison',
    name: 'AIComparison',
    component: () => import('@/views/AIDisplayComparison.vue'),
    meta: { transition: 'fade' },
  },
  // 404页面 - 放在最后，捕获所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { transition: 'fade' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
