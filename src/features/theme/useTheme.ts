/**
 * useTheme.ts — Composable de tema amarelo/azul.
 * @stub — retorna 'amarelo' e uma função toggle.
 * A implementação real (Fase 2) persistirá no localStorage.
 */

import { ref } from 'vue'
import type { Tema } from '@shared/config/tokens'

const tema = ref<Tema>('amarelo')

export function useTheme() {
  function toggle() {
    tema.value = tema.value === 'amarelo' ? 'azul' : 'amarelo'
  }

  return { tema, toggle }
}
