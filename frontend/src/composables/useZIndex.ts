/**
 * Z-Index 工具函数
 * 提供便捷的z-index管理方法
 */

import { Z_INDEX, Z_INDEX_VARS } from '@/config/z-index'

/**
 * 获取z-index值
 */
export function getZIndex(level: keyof typeof Z_INDEX): number {
  return Z_INDEX[level]
}

/**
 * 设置元素的z-index
 */
export function setZIndex(element: HTMLElement, level: keyof typeof Z_INDEX): void {
  element.style.zIndex = String(Z_INDEX[level])
}

/**
 * 获取z-index CSS变量名
 */
export function getZIndexVar(level: keyof typeof Z_INDEX): string {
  const varName = Object.keys(Z_INDEX_VARS).find((key) =>
    key.includes(level.toLowerCase().replace('_', '-')),
  )
  return varName || `--z-${level.toLowerCase().replace('_', '-')}`
}

/**
 * 初始化全局z-index CSS变量
 */
export function initZIndexVars(): void {
  const root = document.documentElement
  Object.entries(Z_INDEX_VARS).forEach(([variable, value]) => {
    root.style.setProperty(variable, String(value))
  })
}

/**
 * 组合式函数：useZIndex
 */
export function useZIndex() {
  return {
    getZIndex,
    setZIndex,
    getZIndexVar,
    Z_INDEX,
  }
}

/**
 * Vue指令：v-z-index
 * 使用方式：v-z-index="'MODAL'"
 */
export const zIndexDirective = {
  mounted(el: HTMLElement, binding: { value: keyof typeof Z_INDEX }) {
    setZIndex(el, binding.value)
  },
  updated(el: HTMLElement, binding: { value: keyof typeof Z_INDEX }) {
    setZIndex(el, binding.value)
  },
}
