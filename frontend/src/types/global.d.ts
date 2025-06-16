declare global {
  interface metric {
    id: string
    icon: Component
    color: 'primary' | 'success' | 'warning' | 'danger'
    label: string
    value: string | number
    visible?: boolean
  }
}
export {}
