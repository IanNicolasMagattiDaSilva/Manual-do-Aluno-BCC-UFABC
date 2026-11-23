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

import { ref } from 'vue'
import { Header, Sidebar, PrevNext } from '@features/navigation'
import { SearchInput } from '@features/search'
import { DownloadPdfButton } from '@features/pdf-export'
import { Hero } from '@widgets/hero'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  title?:   string
  section?: string
  parte?:   string
  tema?:    Tema
}>(), {
  title:   '',
  section: 'ufabc',
  parte:   '',
  tema:    'amarelo',
})

const query = ref('')
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
      <main class="flex-[999_1_560px] min-w-0 py-10 pb-24 max-w-[760px]">
        <Hero v-if="title" :titulo="title" :parte="parte" :tema="tema" />

        <!-- Slot para o conteúdo da página -->
        <div class="mt-10">
          <slot />
        </div>

        <!-- Slot para prev/next (opcional) -->
        <slot name="prevnext" />
      </main>

      <!-- TOC (Table of Contents) -->
      <aside
        aria-label="Nesta página"
        class="flex-[1_1_200px] max-w-[220px] py-10 text-[14px] hidden lg:block"
      >
        <p class="m-0 mb-3 font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-muted">
          Nesta página
        </p>
        <!-- Slot para o TOC gerado dinamicamente na Fase 2 -->
        <slot name="toc" />
      </aside>
    </div>

  </div>
</template>
