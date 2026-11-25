<script setup lang="ts">
/**
 * PdfSumario.vue — Índice paginado do PDF.
 * Convertido de PdfSumario.dc.html (mockup placeholder → spec da issue).
 *
 * Renderiza o sumário completo do manual com entradas agrupadas por parte.
 * Cada entrada `.toc-link` recebe `::after { content: target-counter(…) }`
 * do print.css para exibir o número de página automaticamente via Paged.js.
 *
 * NOTA: layout absoluto apenas para visualização web; na impressão quem controla é @page.
 *
 * Props:
 *   tema — 'amarelo' | 'azul' (default: 'amarelo')
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { themes } from '@shared/config/tokens'
import { listPdfPages, pdfAnchor } from '@shared/lib/content'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  tema?: Tema
}>(), {
  tema: 'amarelo',
})

const t = computed(() => themes[props.tema])

/** Estrutura do sumário — entradas ligadas por âncoras de seção */
interface TocEntry {
  id:    string   // âncora href destino (ex: "#parte-1")
  nivel: 1 | 2   // 1 = parte, 2 = seção
  label: string  // eyebrow ("Parte 01")
  texto: string  // título da entrada
}

/*
 * Gerado a partir de content/*.md (pdf: true), na mesma ordem e agrupamento
 * usados por PdfMarkdownPages — o sumário nunca fica desatualizado.
 */
const PARTES: Record<string, { num: number; texto: string }> = {
  ufabc: { num: 1, texto: 'UFABC' },
  bct:   { num: 2, texto: 'BC&T'  },
  bcc:   { num: 3, texto: 'BCC'   },
}

const entradas = computed<TocEntry[]>(() => {
  const out: TocEntry[] = []
  for (const key of ['ufabc', 'bct', 'bcc']) {
    const parte = PARTES[key]!
    const pages = listPdfPages().filter((p) => p.section === key && p.route !== '/')
    if (pages.length === 0) continue
    out.push({
      id:    `#parte-${parte.num}`,
      nivel: 1,
      label: `Parte ${parte.num}`,
      texto: parte.texto,
    })
    for (const p of pages) {
      out.push({ id: `#${pdfAnchor(p.route)}`, nivel: 2, label: '', texto: p.title })
    }
  }
  return out
})
</script>

<template>
  <!-- Índice full-bleed (page: opener, margem 0) — layout da amostra v1 -->
  <article class="pdf-toc pdf-opener page-break-before" :class="`pdf-toc--${tema}`">
    <header class="pdf-toc__band" :style="{ background: t.bg }">
      <div aria-hidden="true" class="pdf-toc__wafer">
        <Wafer :tema="tema" :w="794" :h="320" :die="100" :ax="1" :ay="0" :seed="5" :fundo="false" />
      </div>
      <div class="pdf-toc__band-text" :style="{ color: t.text }">
        <p class="pdf-toc__eyebrow">Universidade Federal do ABC</p>
        <h1 class="pdf-toc__title" data-pdf-section :style="{ color: t.title }">Índice</h1>
        <p class="pdf-toc__sub">O que você vai encontrar aqui</p>
      </div>
    </header>

    <nav aria-label="Sumário do manual" class="pdf-toc__list">
      <template v-for="entrada in entradas" :key="entrada.id">
        <div v-if="entrada.nivel === 1" class="pdf-toc__parte" :data-n="entrada.label">
          <span class="pdf-toc__parte-n">{{ entrada.label }}</span>
          <a :href="entrada.id" class="pdf-toc__parte-t">{{ entrada.texto }}</a>
        </div>
        <a v-else :href="entrada.id" class="toc-link pdf-toc__item">
          <span class="pdf-toc__item-t">{{ entrada.texto }}</span>
          <span class="pdf-toc__leader" aria-hidden="true" />
        </a>
      </template>
    </nav>

    <footer class="pdf-toc__foot">
      <span>Manual do aluno · Índice</span>
      <span class="pdf-toc__folio"><i />02</span>
    </footer>
  </article>
</template>

<style scoped>
.pdf-toc { position: relative; height: 296mm; overflow: hidden; background: #fff; font-family: var(--font-sans); color: var(--color-fg-default); }
.pdf-toc__band { position: relative; height: 320px; overflow: hidden; }
.pdf-toc__wafer { position: absolute; inset: 0; }
.pdf-toc__band-text { position: absolute; left: 72px; bottom: 34px; }
.pdf-toc__eyebrow { margin: 0 0 8px; font: 700 12px/1 var(--font-mono); letter-spacing: 6px; text-transform: uppercase; }
.pdf-toc__title { margin: 0; font: 400 86px/1 var(--font-display); text-transform: uppercase; }
.pdf-toc__sub { margin: 8px 0 0; font: 500 16px/1.3 var(--font-sans); }
.pdf-toc__list { padding: 40px 72px 0; }
.pdf-toc__parte { display: flex; align-items: baseline; gap: 14px; margin-top: 22px; padding-bottom: 6px; border-bottom: 2px solid var(--color-fg-default); }
.pdf-toc__parte:first-child { margin-top: 0; }
.pdf-toc__parte-n { font: 700 12px/1 var(--font-mono); color: var(--color-brand-verde); }
.pdf-toc__parte[data-n="Parte 3"] .pdf-toc__parte-n { color: var(--color-brand-azul); }
.pdf-toc__parte-t { font: 400 26px/1 var(--font-display); text-transform: uppercase; color: var(--color-fg-default); }
.pdf-toc__item { display: flex; align-items: baseline; gap: 8px; padding: 5px 0; font: 400 13.5px/1.3 var(--font-sans); color: var(--color-fg-default); }
.pdf-toc__leader { flex: 1; order: 1; border-bottom: 1.5px dotted #A0AAB4; transform: translateY(-3px); }
.pdf-toc__foot { position: absolute; left: 72px; right: 72px; bottom: 34px; display: flex; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--color-border-subtle); font: 400 11px/1 var(--font-mono); letter-spacing: 3px; text-transform: uppercase; color: #5A6472; }
.pdf-toc__folio { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; letter-spacing: 0; color: var(--color-fg-default); }
.pdf-toc__folio i { width: 7px; height: 7px; background: var(--color-brand-amarelo); display: inline-block; }
</style>
