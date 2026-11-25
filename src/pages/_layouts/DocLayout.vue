<script setup lang="ts">
/**
 * DocLayout.vue — Layout de página de documentação.
 * Sidebar à esquerda + conteúdo central + TOC à direita.
 *
 * Composição de features acontece aqui (camada pages):
 *   - features/navigation (Header, Sidebar)
 *   - features/search (SearchInput)
 *   - features/pdf-export (DownloadPdfButton)
 *   - widgets/hero (Hero)
 *
 * Props:
 *   title   — título da página (para sidebar e breadcrumb)
 *   section — seção do nav ativa: 'ufabc' | 'bct' | 'bcc'
 *   parte   — eyebrow do hero
 *   tema    — 'amarelo' | 'azul'
 */

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Header, Sidebar, PrevNext } from '@features/navigation'
import { SearchInput } from '@features/search'
import { DownloadPdfButton } from '@features/pdf-export'
import { Hero } from '@widgets/hero'
import { getPrevNext } from '@shared/lib/content'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  title?:        string
  section?:      string
  parte?:        string
  tema?:         Tema
  hidePrevNext?: boolean
}>(), {
  title:        '',
  section:      'ufabc',
  parte:        '',
  tema:         'amarelo',
  hidePrevNext: false,
})

const query = ref('')
const route = useRoute()

/*
 * prev/next derivados de content.ts a partir da rota atual. Convertido para
 * o formato esperado pelo PrevNext.vue ({ label, to }). Se a rota não tiver
 * entrada em content/, ambos retornam null e o PrevNext some.
 */
const nav = computed(() => {
  const { prev, next } = getPrevNext(route.path)
  return {
    prev: prev ? { label: prev.title, to: prev.route } : null,
    next: next ? { label: next.title, to: next.route } : null,
  }
})

const showPrevNext = computed(() =>
  !props.hidePrevNext && (nav.value.prev !== null || nav.value.next !== null),
)
</script>

<template>
  <div class="min-h-screen bg-bg-default text-fg-default font-sans text-[16px] leading-[1.7]">

    <Header :ativo="section">
      <template #actions>
        <SearchInput v-model="query" />
        <DownloadPdfButton />
      </template>
    </Header>

    <div
      class="max-w-[var(--width-content-doc)] mx-auto px-8 flex flex-wrap gap-12 items-start box-border"
    >
      <!-- Sidebar -->
      <Sidebar :atual="title" />

      <!-- Conteúdo principal -->
      <main class="flex-[999_1_560px] min-w-0 py-10 pb-24 max-w-[920px]">
        <Hero v-if="title" :titulo="title" :parte="parte" :tema="tema" />

        <!-- Slot para o conteúdo da página -->
        <div class="mt-10">
          <slot />
        </div>

        <!--
          prev/next automático a partir de content/. O slot `prevnext`
          permite override manual se a página tiver navegação customizada.
        -->
        <slot name="prevnext">
          <PrevNext v-if="showPrevNext" :prev="nav.prev" :next="nav.next" />
        </slot>
      </main>
    </div>

  </div>
</template>
