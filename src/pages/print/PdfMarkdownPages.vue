<script setup lang="ts">
/**
 * PdfMarkdownPages.vue — Composição completa das partes 1-3 do PDF a partir
 * de content/*.md. Agrupa as páginas por `section` (ufabc | bct | bcc) e
 * insere a abertura PdfParte antes das páginas de cada seção.
 *
 * Substitui a composição manual anterior (PdfParte 1 + PdfTexto + PdfParte 2 +
 * PdfParte 3) por uma composição data-driven: basta adicionar um .md com
 * `pdf: true` na pasta correta e ele entra no PDF na posição definida por
 * `order`.
 *
 * Mantém a paridade visual com PdfTexto.vue (A4 portrait, tipografia 11pt).
 * Markdown é renderizado via @shared/lib/markdown (com anchor, attrs, callouts).
 */

import { computed } from 'vue'
import { listPdfPages } from '@shared/lib/content'
import { renderMarkdown } from '@shared/lib/markdown'
import { PdfFolio } from '@features/pdf-export'
import PdfParte from './PdfParte.vue'
import type { Tema } from '@shared/config/tokens'
import type { ContentPage } from '@shared/lib/content'

interface SectionGroup {
  key:    string
  num:    string
  label:  string
  titulo: string
  tema:   Tema
  seed:   number
  pages:  ContentPage[]
}

/*
 * Metadados de cada parte. Fonte de verdade local — o tema/seed/titulo da
 * abertura não vem do frontmatter porque é propriedade de apresentação do
 * PDF, não do conteúdo da seção.
 */
const PARTS: Record<string, Omit<SectionGroup, 'pages'>> = {
  ufabc: { key: 'ufabc', num: '01', label: 'UFABC', titulo: 'A universidade e seus campi',       tema: 'amarelo', seed: 7  },
  bct:   { key: 'bct',   num: '02', label: 'BC&T',  titulo: 'O Bacharelado em Ciência e Tecnologia', tema: 'amarelo', seed: 11 },
  bcc:   { key: 'bcc',   num: '03', label: 'BCC',   titulo: 'O Bacharelado em Ciência da Computação', tema: 'azul',    seed: 17 },
}

function stripLeadingH1(body: string): string {
  return body.replace(/^\s*#\s+[^\n]*\n+/, '')
}

const sections = computed<SectionGroup[]>(() => {
  const groups = new Map<string, SectionGroup>()
  for (const p of listPdfPages()) {
    if (p.route === '/') continue           // home não entra nas partes
    const meta = PARTS[p.section]
    if (!meta) continue                     // seções desconhecidas são ignoradas
    let g = groups.get(p.section)
    if (!g) { g = { ...meta, pages: [] }; groups.set(p.section, g) }
    g.pages.push(p)
  }
  // ordena as seções pela ordem natural das partes
  return ['ufabc', 'bct', 'bcc'].map((k) => groups.get(k)).filter(Boolean) as SectionGroup[]
})
</script>

<template>
  <template v-for="section in sections" :key="section.key">
    <!-- Abertura da parte -->
    <PdfParte
      :num="section.num"
      :label="section.label"
      :titulo="section.titulo"
      :tema="section.tema"
      :seed="section.seed"
    />

    <!-- Páginas de conteúdo da parte -->
    <article
      v-for="p in section.pages"
      :key="p.file"
      :data-section-label="`Parte ${section.num} · ${section.label}`"
      class="pdf-md max-w-[794px] mx-auto bg-bg-default text-fg-default font-sans text-[11pt] leading-[1.65] box-border px-[72px] pt-[64px] pb-[48px]"
    >
      <!-- Eyebrow / parte -->
      <p class="m-0 mb-2 font-mono text-[8pt] font-bold tracking-[3px] uppercase text-brand-azul">
        Parte {{ section.num }} · {{ section.label }}
      </p>

      <!--
        h1 com data-pdf-section: ativa a named page `section` no print.css
        e registra o título corrente para o cabeçalho das páginas seguintes.
        O corpo Markdown entra sem seu h1 (duplicaria o título do frontmatter).
      -->
      <h1
        data-pdf-section
        class="m-0 mb-6 font-display font-normal text-[36pt] leading-[1.05] uppercase text-fg-default"
      >
        {{ p.title }}
      </h1>

      <!-- Linha decorativa sob o título -->
      <div class="w-16 h-1 bg-brand-amarelo mb-8" />

      <!-- Corpo Markdown renderizado -->
      <div class="markdown-body" v-html="renderMarkdown(stripLeadingH1(p.body))" />

      <!-- Rodapé da seção -->
      <PdfFolio
        :secao="`Parte ${section.num} · ${section.label}`"
        :num="String(p.order).padStart(2, '0')"
        :w="650"
      />
    </article>
  </template>
</template>

<style scoped>
/*
 * Tipografia do conteúdo gerado pelo markdown-it. Pensado para A4:
 *   - h2/h3 com Anton, uppercase
 *   - parágrafos em fg-strong para contraste tipográfico
 *   - callouts (aside[data-callout]) com borda colorida por tipo
 */
.markdown-body :deep(h2) {
  margin:          2rem 0 0.75rem;
  font-family:     var(--font-display);
  font-weight:     400;
  font-size:       18pt;
  line-height:     1.1;
  text-transform:  uppercase;
  letter-spacing:  0.3px;
  color:           var(--color-fg-default);
}

.markdown-body :deep(h3) {
  margin:          1.5rem 0 0.5rem;
  font-family:     var(--font-sans);
  font-weight:     700;
  font-size:       12pt;
  line-height:     1.25;
  color:           var(--color-fg-default);
}

.markdown-body :deep(p) {
  margin:          0 0 0.75rem;
  color:           var(--color-fg-strong);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin:          0 0 0.75rem;
  padding-left:    1.25rem;
  color:           var(--color-fg-strong);
}

.markdown-body :deep(li)     { margin: 0.25rem 0; }
.markdown-body :deep(strong) { color: var(--color-fg-default); }

.markdown-body :deep(table) {
  width:           100%;
  border-collapse: collapse;
  font-size:       10pt;
  margin:          1rem 0 1.5rem;
  break-inside:    avoid;
}

.markdown-body :deep(th) {
  text-align:      left;
  padding:         0.4rem 0.6rem;
  background:      var(--color-fg-default);
  color:           var(--color-bg-default);
  font-family:     var(--font-mono);
  font-size:       8pt;
  letter-spacing:  2px;
  text-transform:  uppercase;
  font-weight:     600;
}

.markdown-body :deep(td) {
  padding:         0.4rem 0.6rem;
  border-bottom:   1px solid var(--color-border-subtle);
}

.markdown-body :deep(tr:nth-child(even) td) {
  background:      var(--color-bg-surface);
}

.markdown-body :deep(aside[data-callout]) {
  margin:          1rem 0;
  padding:         0.75rem 1rem;
  border-left:     4px solid var(--color-brand-azul);
  background:      var(--color-bg-azul-soft);
  break-inside:    avoid;
}
.markdown-body :deep(aside[data-callout] > p:last-child) { margin-bottom: 0; }

.markdown-body :deep(aside[data-callout="warning"])   { border-left-color: #B45309; background: #FEF3C7; }
.markdown-body :deep(aside[data-callout="caution"])   { border-left-color: var(--color-status-erro); background: #FEE2E2; }
.markdown-body :deep(aside[data-callout="important"]) { border-left-color: var(--color-brand-verde); background: #E6F4EC; }
.markdown-body :deep(aside[data-callout="tip"])       { border-left-color: var(--color-brand-azul-escuro); background: var(--color-bg-azul-soft); }
.markdown-body :deep(aside[data-callout="note"])      { border-left-color: var(--color-fg-muted); background: var(--color-bg-surface); }
</style>
