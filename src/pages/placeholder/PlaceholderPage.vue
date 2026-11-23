<script setup lang="ts">
/**
 * PlaceholderPage.vue — Página temporária usada enquanto as páginas
 * reais não existem. Exibe o layout completo (Header + Sidebar + main)
 * com um aviso de "em construção".
 *
 * Injeta SearchInput e DownloadPdfButton no slot actions do Header
 * (a composição de features acontece aqui, na camada pages).
 */

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Header, Sidebar } from '@features/navigation'
import { SearchInput } from '@features/search'
import { DownloadPdfButton } from '@features/pdf-export'
import { Hero } from '@widgets/hero'

const props = withDefaults(defineProps<{
  title?:   string
  section?: string
}>(), {
  title:   'Em construção',
  section: 'inicio',
})

const route   = useRoute()
const isHome  = computed(() => route.path === '/')
const tema    = computed(() => props.section === 'bcc' ? 'azul' as const : 'amarelo' as const)
const query   = ref('')
</script>

<template>
  <div class="min-h-screen bg-bg-default text-fg-default font-sans">

    <Header :ativo="section">
      <template #actions>
        <SearchInput v-model="query">
          <template #shortcut>
            <span class="border border-border-strong px-1.5 text-[11px]">/</span>
          </template>
        </SearchInput>
        <DownloadPdfButton />
      </template>
    </Header>

    <!-- Home: sem sidebar -->
    <div v-if="isHome" class="max-w-[var(--width-content-home)] mx-auto px-8 py-24 text-center">
      <p class="font-mono text-[13px] font-bold tracking-[4px] uppercase text-brand-verde mb-4">
        Em construção
      </p>
      <h1 class="font-display [font-size:clamp(48px,8vw,96px)] leading-none uppercase mb-6">
        Manual do Aluno
      </h1>
      <p class="text-fg-strong text-[18px] max-w-xl mx-auto">
        Esta página está sendo construída. Volte em breve!
      </p>
    </div>

    <!-- Páginas de doc: com sidebar -->
    <div
      v-else
      class="max-w-[var(--width-content-doc)] mx-auto px-8 flex flex-wrap gap-12 items-start box-border"
    >
      <Sidebar :atual="title" />

      <main class="flex-[999_1_560px] min-w-0 py-10 pb-24">
        <Hero :titulo="title" :tema="tema" />
        <div class="mt-10 p-8 border-2 border-dashed border-border-strong text-center text-fg-muted">
          <p class="font-mono text-[12px] tracking-[3px] uppercase mb-2">Fase 2</p>
          <p class="text-[16px]">Conteúdo desta página será adicionado na Fase 2.</p>
        </div>
      </main>
    </div>

  </div>
</template>
