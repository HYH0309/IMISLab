import type { ColorType, ColorStylesMap } from '@/types/admin'

/**
 * 获取指定颜色的样式类
 * @param color 颜色类型
 * @param variant 样式变体
 * @param colorStyles 颜色样式映射
 * @returns 对应的样式类字符串
 */
export const getColorClass = (
  color: ColorType,
  variant: keyof ColorStylesMap[ColorType],
  colorStyles: ColorStylesMap,
): string => {
  return colorStyles[color]?.[variant] || ''
}

/**
 * 组合样式类
 * @param classes 样式类数组
 * @returns 组合后的样式类字符串
 */
export const combineClasses = (...classes: (string | string[] | undefined)[]): string => {
  return classes.flat().filter(Boolean).join(' ')
}
