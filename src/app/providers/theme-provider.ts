/**
 * theme-provider.ts — Stub do provider global de tema.
 *
 * Responsabilidade: injetar o tema atual (amarelo/azul) via
 * Vue provide/inject para que qualquer componente possa consumi-lo
 * sem prop-drilling.
 *
 * Uso (na Fase 2):
 *   // em App.vue ou main.ts:
 *   import { setupThemeProvider } from '@app/providers/theme-provider'
 *   setupThemeProvider(app)
 *
 *   // em qualquer componente:
 *   import { injectTheme } from '@app/providers/theme-provider'
 *   const { tema, toggle } = injectTheme()
 */

import type { App, InjectionKey, Ref } from 'vue'
import { ref, inject } from 'vue'
import type { Tema } from '@shared/config/tokens'

export const THEME_KEY: InjectionKey<{
  tema: Ref<Tema>
  toggle: () => void
}> = Symbol('theme')

export function setupThemeProvider(app: App) {
  const tema = ref<Tema>('amarelo')
  const toggle = () => {
    tema.value = tema.value === 'amarelo' ? 'azul' : 'amarelo'
  }
  app.provide(THEME_KEY, { tema, toggle })
}

export function injectTheme() {
  const ctx = inject(THEME_KEY)
  if (!ctx) throw new Error('injectTheme: provider não encontrado. Use setupThemeProvider.')
  return ctx
}
