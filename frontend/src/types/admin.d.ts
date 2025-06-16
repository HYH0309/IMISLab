import type { Component } from 'vue'

// 颜色类型 - 简化为三种主要颜色
export type ColorType = 'blue' | 'green' | 'purple'

// 标签页配置接口
export interface TabConfig {
  id: string
  name: string
  component: Component
  icon: Component
  activeIcon: Component
  description: string
  color: ColorType
}

// 统计数据配置接口
export interface StatConfig {
  label: string
  value: number
  icon: Component
  color: ColorType
}

// 颜色样式配置接口
export interface ColorStyleConfig {
  bg: string
  text: string
  border: string
  active: string
  indicator: string
  ring: string
}

// 基础样式配置接口
export interface BaseClassConfig {
  card: string
  button: string
  heading: string
  subtext: string
  badge: string
  input: string
}

// 颜色样式映射类型
export type ColorStylesMap = Record<ColorType, ColorStyleConfig>
