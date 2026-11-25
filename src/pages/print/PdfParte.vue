<script setup lang="ts">
/**
 * PdfParte.vue — Abertura editorial v2 de cada parte do PDF.
 * Baseado em EPdfParte.dc.html.
 *
 * Layout (full-bleed, @page opener com margin: 0):
 *   ┌───────────────────────────┐
 *   │ ▓▓▓▓ banda amarela ▓▓▓▓▓ │ ← wafer + running header
 *   │                           │
 *   │ 02                        │ ← Anton 260 preto, extravasa pra baixo
 *   ├───────────────────────────┤
 *   │ PARTE 2                   │
 *   │ BC&T                      │ ← h1 Anton 84 (string-set)
 *   │ Bacharelado em Ciência…   │
 *   │ ─────────────────────     │
 *   │ 2.1  Capítulo             │ ← lista de content.ts
 *   └───────────────────────────┘
 *
 * Layout em FLEX/FLOW em vez de absolute: evita problemas com Paged.js que
 * nem sempre respeita width/height fixos quando a @page muda de nome.
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { themes } from '@shared/config/tokens'
import { listPdfPages } from '@shared/lib/content'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  section?:   string
  num?:       string
  label?:     string
  titulo?:    string
  subtitulo?: string
  tema?:      Tema
  seed?:      number
}>(), {
  section:   'ufabc',
  num:       '01',
  label:     'UFABC',
  titulo:    'A universidade e seus campi',
  subtitulo: '',
  tema:      'amarelo',
  seed:      7,
})

const t = computed(() => themes[props.tema])

const caps = computed(() =>
  listPdfPages()
    .filter((p) => p.section === props.section)
    .map((p, i) => ({
      n: `${Number(props.num)}.${i + 1}`,
      t: p.title,
    })),
)

const runningHeader = computed(() => `Manual do aluno · ${props.label}`)
const partLabel     = computed(() => `Parte ${Number(props.num)}`)
</script>

<template>
  <!--
    Wrapper full-page. `pdf-opener` o coloca na @page opener (margin: 0,
    sem running headers) e força 210×297mm (print.css). Flex vertical:
    - banda amarela cresce para ocupar ~60% da altura
    - bloco inferior branco com título + lista
  -->
  <article
    :id="`parte-${Number(num)}`"
    class="pdf-parte pdf-opener page-break-before relative flex flex-col overflow-hidden bg-bg-default text-fg-default font-sans"
  >
    <!--
      Banda superior amarela com wafer. overflow-hidden NO wafer (não na
      banda inteira), para o número "02" conseguir extravasar pra baixo
      a partir do próprio article.
    -->
    <div
      class="pdf-parte__band relative"
      :style="{ background: t.bg }"
    >
      <!-- Wafer full-bleed, clipado pela banda -->
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
        <Wafer
          :tema="tema"
          :w="794"
          :h="500"
          :die="112"
          :ax="1"
          :ay="0"
          :seed="seed"
          :fundo="false"
        />
      </div>

      <!-- Running header dentro da banda -->
      <p
        class="absolute left-[72px] top-[56px] m-0 font-mono text-[12px] font-bold tracking-[3px] uppercase"
        :style="{ color: t.text }"
      >
        {{ runningHeader }}
      </p>

      <!--
        Número gigante posicionado no article (não na banda), com top calculado
        para extravasar ~34px abaixo da borda da banda.
        Bottom-aligned no band + leaking into white = o visual da target.
      -->
      <span
        aria-hidden="true"
        class="pdf-parte__num absolute left-[62px] font-display text-[260px] leading-none"
        :style="{ color: t.title }"
      >
        {{ num }}
      </span>
    </div>


    <!-- ───────── Bloco inferior: títulos + lista ───────── -->
    <div class="pdf-parte__body flex-1 px-[72px] pt-[52px]">
      <p class="m-0 mb-[6px] font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-muted">
        {{ partLabel }}
      </p>

      <h1
        data-pdf-section
        :data-section-label="`Parte ${Number(num)} · ${label}`"
        class="m-0 font-display font-normal text-[84px] leading-none uppercase tracking-[0.3px] text-fg-default"
      >
        {{ label }}
      </h1>

      <p
        v-if="subtitulo"
        class="mt-[10px] mb-0 text-[20px]"
        style="color: #2D3748"
      >
        {{ subtitulo }}
      </p>

      <!-- Lista de capítulos -->
      <ol class="list-none m-0 mt-11 p-0 border-t border-fg-default text-[16px]">
        <li
          v-for="c in caps"
          :key="c.n"
          class="flex gap-5 py-[10px] border-b border-border-subtle"
        >
          <span class="font-mono text-[13px] text-fg-muted w-8 shrink-0">
            {{ c.n }}
          </span>
          <span>{{ c.t }}</span>
        </li>
      </ol>
    </div>
  </article>
</template>

<style scoped>
/*
 * Banda amarela — altura fixa de 500px para dar peso visual à abertura.
 * Em A4 (297mm = 1123px), 500px é ~45% da altura, deixando espaço largo
 * embaixo para o título + lista.
 */
/*
 * Banda amarela — altura fixa calculada para ficar ~60% da altura A4.
 * 297mm * 0.6 = ~178mm = ~674px a 96dpi.
 */
.pdf-parte__band {
  height: 132mm;
  overflow: hidden;
  flex-shrink: 0;
}

/*
 * Número gigante: posicionado abaixo da banda. top = banda height - leading
 * do número ( 260px / 1 ) + 34px overflow. Resolve absolute no article.
 */
.pdf-parte__num {
  top: calc(132mm - 226px);
}
</style>
