/**
 * tokens.ts — Re-exporta os design tokens em TypeScript.
 * Útil para lógica JS que precise dos valores (ex.: geração do Wafer,
 * cálculo de cores no Logo). Os mesmos valores estão em theme.css @theme.
 * Regra: se mudar um token aqui, mudar também no theme.css.
 */

export const colors = {
  brandAzul:        '#008BBB',
  brandAzulEscuro:  '#006E95',
  brandAzulClaro:   '#3FB8E5',
  brandAmarelo:     '#FFCC00',
  brandVerde:       '#006633',

  fgDefault:        '#0E1726',
  fgStrong:         '#2D3748',
  fgMuted:          '#4A5568',
  fgOnAzul:         '#04222F',
  fgOnDarkMuted:    '#D5DCE3',

  bgDefault:        '#FFFFFF',
  bgAzulSoft:       '#E6F4F9',
  bgSurface:        '#F3F5F7',

  borderSubtle:     '#E2E6EA',
  borderStrong:     '#CBD2D9',

  statusErro:       '#B3261E',
} as const

export type ColorToken = keyof typeof colors

export const fonts = {
  display: "'Anton', sans-serif",
  sans:    "'Inter', system-ui, sans-serif",
  mono:    "'JetBrains Mono', monospace",
} as const

/** Variantes de tema do Hero / Wafer */
export const themes = {
  amarelo: {
    bg:    colors.brandAmarelo,
    title: colors.fgDefault,
    text:  colors.fgDefault,
  },
  azul: {
    bg:    colors.brandAzul,
    title: '#FFFFFF',
    text:  colors.fgOnAzul,
  },
} as const

export type Tema = keyof typeof themes
