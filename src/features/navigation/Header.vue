<script setup lang="ts">
/**
 * Header.vue — Cabeçalho do site.
 * Convertido de Header.dc.html.
 *
 * Props:
 *   ativo — qual seção do nav está ativa: 'inicio' | 'ufabc' | 'bct' | 'bcc'
 *
 * Slots:
 *   actions — área direita do header (busca + botão PDF).
 *             As páginas/layouts injetam SearchInput e DownloadPdfButton aqui,
 *             mantendo a regra de que features não importam outras features.
 *             Padrão: vazio.
 */

import { computed } from 'vue'
import { Logo } from '@shared/ui/Logo'

interface NavItem {
  key:   string
  label: string
  to:    string
}

const props = withDefaults(defineProps<{ ativo?: string }>(), {
  ativo: 'inicio',
})

const NAV_ITEMS: NavItem[] = [
  { key: 'inicio', label: 'Início', to: '/'            },
  { key: 'ufabc',  label: 'UFABC',  to: '/ufabc/campi' },
  { key: 'bct',    label: 'BC&T',   to: '/bct/sobre'   },
  { key: 'bcc',    label: 'BCC',    to: '/bcc/sobre'   },
]

const links = computed(() =>
  NAV_ITEMS.map(item => ({
    ...item,
    active: item.key === props.ativo,
  }))
)
</script>

<template>
  <header class="w-full border-b border-border-subtle bg-bg-default font-sans text-fg-default">
    <div class="max-w-[var(--width-content-doc)] mx-auto px-8 py-[14px] flex flex-wrap items-center gap-6 box-border">

      <!-- Logo + título -->
      <RouterLink
        to="/"
        class="flex items-center gap-[14px] no-underline text-fg-default"
      >
        <Logo :cell="3" color="#008BBB" />
        <span
          class="font-display text-[18px] tracking-[0.5px] uppercase border-l border-border-strong pl-[14px]"
        >
          Manual do aluno
        </span>
      </RouterLink>

      <!-- Nav principal -->
      <nav aria-label="Principal" class="flex flex-wrap gap-1 flex-1">
        <RouterLink
          v-for="link in links"
          :key="link.key"
          :to="link.to"
          class="px-[14px] py-[10px] no-underline text-[15px]"
          :class="link.active
            ? 'text-fg-default font-semibold border-b-[3px] border-brand-azul'
            : 'text-fg-muted font-medium border-b-[3px] border-transparent'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Área de ações (busca + PDF) — injetada pelo layout pai -->
      <slot name="actions" />

    </div>
  </header>
</template>
