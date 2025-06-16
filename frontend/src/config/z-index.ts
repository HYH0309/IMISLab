/**
 * Z-Index 层级管理配置
 * 统一管理应用中所有组件的z-index值
 */

export const Z_INDEX = {
  // 基础层级 (1-10)
  BASE: 1,
  CONTENT: 5,
  ROUTE_LOADING: 10,

  // UI组件层级 (11-50)
  DROPDOWN: 15,
  TOOLTIP: 20,
  PROGRESS_BAR: 25,
  THEME_TOGGLE: 30,
  NAVBAR: 40,
  MUSIC_PLAYER: 50,

  // 弹窗层级 (51-90)
  MODAL_BACKDROP: 60,
  MODAL: 70,
  NOTIFICATION: 80,
  POPOVER: 85,

  // 最高层级 (91-100)
  LOADING: 95,
  ERROR: 100,
} as const

export type ZIndexLevel = (typeof Z_INDEX)[keyof typeof Z_INDEX]

/**
 * 获取z-index值的工具函数
 */
export const getZIndex = (level: keyof typeof Z_INDEX): number => {
  return Z_INDEX[level]
}

/**
 * CSS变量映射
 */
export const Z_INDEX_VARS = {
  '--z-base': Z_INDEX.BASE,
  '--z-content': Z_INDEX.CONTENT,
  '--z-route-loading': Z_INDEX.ROUTE_LOADING,
  '--z-dropdown': Z_INDEX.DROPDOWN,
  '--z-tooltip': Z_INDEX.TOOLTIP,
  '--z-progress-bar': Z_INDEX.PROGRESS_BAR,
  '--z-theme-toggle': Z_INDEX.THEME_TOGGLE,
  '--z-navbar': Z_INDEX.NAVBAR,
  '--z-music-player': Z_INDEX.MUSIC_PLAYER,
  '--z-modal-backdrop': Z_INDEX.MODAL_BACKDROP,
  '--z-modal': Z_INDEX.MODAL,
  '--z-notification': Z_INDEX.NOTIFICATION,
  '--z-popover': Z_INDEX.POPOVER,
  '--z-loading': Z_INDEX.LOADING,
  '--z-error': Z_INDEX.ERROR,
} as const

/**
 * 响应式z-index处理
 * 在移动端可能需要调整某些组件的层级
 */
export const getMobileZIndex = (level: keyof typeof Z_INDEX): number => {
  const base = Z_INDEX[level]

  // 移动端特殊处理
  switch (level) {
    case 'NAVBAR':
      return base + 5 // 导航栏在移动端提高优先级
    case 'THEME_TOGGLE':
      return base - 5 // 主题切换在移动端降低优先级
    default:
      return base
  }
}
