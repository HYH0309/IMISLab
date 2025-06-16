import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  transformers: [transformerVariantGroup(), transformerDirectives()],

  shortcuts: {
    // 布局
    'flex-center': 'flex items-center justify-center',
    'grid-center': 'grid place-items-center',

    // 按钮
    btn: [
      'relative font-medium whitespace-nowrap rounded-lg border',
      'transition-all duration-200 ease-out',
      'focus-visible:(outline-none ring-2 ring-primary/50 ring-offset-2)',
      'hover:brightness-[98%]',
      'disabled:(opacity-50 cursor-not-allowed grayscale)',
      'motion-safe:hover:shadow-md',
    ].join(' '),
    'btn-primary':
      'btn bg-primary text-white shadow-md hover:(bg-primary-hover shadow-lg) active:(bg-primary-active shadow-inner)',
    'btn-ghost': 'btn border-border/80 bg-transparent hover:(bg-muted-hover/40) active:bg-muted/60',
    'btn-sm': 'px-3 py-1.5 text-sm',
    'btn-md': 'px-4 py-2 text-base',
    'btn-lg': 'px-6 py-3 text-lg',
    'btn-icon': 'p-1.5 aspect-square !rounded-full w-5 h-5',

    // 标签按钮
    'tag-btn':
      'btn px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border bg-background/70 text-text',
    'tag-active':
      'border-success/80 text-success bg-success/10 hover:bg-success/20 dark:border-success/50 dark:bg-success/20 relative after:absolute after:-inset-[2px] after:rounded-full after:border after:border-success/20',

    // 卡片
    'card-base':
      'p-6 rounded-lg border border-border/50 bg-background shadow-md hover:shadow-lg transition-all duration-200 ease-out dark:border-dark-500 dark:hover:bg-dark-700',
    'card-disabled': 'card-base bg-muted cursor-not-allowed text-muted-foreground shadow-inner',

    // 过渡
    'theme-transition': 'transition-all duration-200 ease-in-out',

    // 布局系统
    'flex-layout':
      'flex gap-4 data-[direction=horizontal]:md:flex-row data-[direction=vertical]:flex-col',
    'content-layout': 'p-4 flex flex-col gap-4',
    'panel-base': 'bg-muted/50 border-border/50 rounded-lg p-3 theme-transition',
  },

  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      text: 'hsl(var(--text))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      muted: 'hsl(var(--muted))',
      'muted-hover': 'hsl(var(--muted-hover))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
      border: 'hsl(var(--border))',
      'border-hover': 'hsl(var(--border-hover))',
      primary: 'hsl(var(--primary))',
      'primary-hover': 'hsl(var(--primary-hover))',
      'primary-active': 'hsl(var(--primary-active))',
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
      danger: 'hsl(var(--danger))',
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
    boxShadow: {
      md: 'var(--shadow-md)',
      'md-dark': 'var(--shadow-md-dark)',
      lg: 'var(--shadow-lg)',
      'lg-dark': 'var(--shadow-lg-dark)',
    },
  },
})
