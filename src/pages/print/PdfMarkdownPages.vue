<script setup lang="ts">
/**
 * PdfMarkdownPages.vue — Paginas editoriais v2 do PDF geradas a partir
 * de content/*.md. Baseado em EPdfTexto, ECallout e ESection do zip.
 *
 * Fluxo:
 *   1. Agrupa listPdfPages() por secao (ufabc | bct | bcc)
 *   2. Para cada secao: insere PdfParte (abertura) + N paginas de texto
 *   3. Cada pagina de texto:
 *      - Badge amarela X.Y (X = parte, Y = ordem dentro da parte)
 *      - Eyebrow mono "Parte X . Label"
 *      - h1 Anton 44px (data-pdf-section) — alimenta o cabecalho corrente
 *      - Lead (primeiro paragrafo) com border-bottom 1px #0E1726
 *      - Corpo Markdown com H2 numerados via CSS counter
 *
 * A numeracao de H2 (01, 02, 03) sai de um counter CSS — o Markdown bruto
 * fica limpo, sem precisar de sintaxe extra.
 */

import { computed } from 'vue'
import { listPdfPages, pdfAnchor } from '@shared/lib/content'
import { renderMarkdown } from '@shared/lib/markdown'
import PdfParte from './PdfParte.vue'
import type { Tema } from '@shared/config/tokens'
import type { ContentPage } from '@shared/lib/content'

interface PageExpanded extends ContentPage {
  badge: string
  html:  string
  lead:  string
}

interface SectionGroup {
  key:       string
  num:       string
  label:     string
  titulo:    string
  subtitulo: string
  tema:      Tema
  seed:      number
  pages:     PageExpanded[]
}

const PARTS: Record<string, Omit<SectionGroup, 'pages'>> = {
  ufabc: {
    key: 'ufabc', num: '01', label: 'UFABC',
    titulo: 'UFABC', subtitulo: 'A universidade e seus campi',
    tema: 'amarelo', seed: 7,
  },
  bct: {
    key: 'bct', num: '02', label: 'BC&T',
    titulo: 'BC&T', subtitulo: 'Bacharelado em Ciencia e Tecnologia',
    tema: 'amarelo', seed: 13,
  },
  bcc: {
    key: 'bcc', num: '03', label: 'BCC',
    titulo: 'BCC', subtitulo: 'Bacharelado em Ciencia da Computacao',
    tema: 'azul', seed: 17,
  },
}

function stripLeadingH1(body: string): string {
  return body.replace(/^\s*#\s+[^\n]*\n+/, '')
}

/** Separa o primeiro paragrafo (lead) do restante do corpo. */
function splitLead(body: string): { lead: string; rest: string } {
  const bodyNoH1 = stripLeadingH1(body)
  const trimmed  = bodyNoH1.trimStart()
  const idx = trimmed.indexOf('\n\n')
  if (idx < 0) return { lead: trimmed, rest: '' }
  return {
    lead: trimmed.slice(0, idx).trim(),
    rest: trimmed.slice(idx + 2),
  }
}

/** Renderiza o lead removendo as tags <p> do markdown-it. */
function renderLeadInline(md: string): string {
  const html = renderMarkdown(md).trim()
  return html
    .replace(/^<p[^>]*>/, '')
    .replace(/<\/p>\s*$/, '')
}

const sections = computed<SectionGroup[]>(() => {
  const groups = new Map<string, SectionGroup>()

  for (const p of listPdfPages()) {
    if (p.route === '/') continue
    const meta = PARTS[p.section]
    if (!meta) continue

    let g = groups.get(p.section)
    if (!g) { g = { ...meta, pages: [] }; groups.set(p.section, g) }

    const partNum = Number(meta.num)
    const idx     = g.pages.length + 1
    const { lead, rest } = splitLead(p.body)

    g.pages.push({
      ...p,
      badge: `${partNum}.${idx}`,
      lead:  renderLeadInline(lead),
      html:  renderMarkdown(rest),
    })
  }

  return ['ufabc', 'bct', 'bcc']
    .map((k) => groups.get(k))
    .filter(Boolean) as SectionGroup[]
})
</script>

<template>
  <template v-for="section in sections" :key="section.key">
    <!-- Abertura da parte -->
    <PdfParte
      :section="section.key"
      :num="section.num"
      :label="section.label"
      :titulo="section.titulo"
      :subtitulo="section.subtitulo"
      :tema="section.tema"
      :seed="section.seed"
    />

    <!-- Paginas editoriais -->
    <article
      v-for="p in section.pages"
      :key="p.file"
      :id="pdfAnchor(p.route)"
      :data-section-label="`Parte ${Number(section.num)} · ${section.label}`"
      :data-folio="`${p.badge} · ${p.title}`"
      class="pdf-md page-break-before bg-bg-default text-fg-default font-sans text-[17px] leading-[1.65]"
    >
      <!-- Header editorial -->
      <header class="pdf-md__header" style="padding-top: 14px">
        <div class="flex items-center gap-3 mb-3">
          <span class="h-8 px-2 inline-flex items-center bg-brand-amarelo font-display text-[18px] leading-none">
            {{ p.badge }}
          </span>
          <span class="font-mono text-[12px] font-bold tracking-[2.5px] uppercase text-fg-default">
            Parte {{ Number(section.num) }} · {{ section.label }}
          </span>
        </div>

        <h1
          data-pdf-section
          class="m-0 font-display font-normal text-[44px] leading-[1.05] uppercase tracking-[0.3px] text-fg-default"
        >
          {{ p.title }}
        </h1>

        <p
          v-if="p.lead"
          class="pdf-md__lead mt-[14px] mb-0 pb-5 text-[17px] leading-[1.55]"
          style="color: #2D3748; border-bottom: 1px solid #0E1726"
          v-html="p.lead"
        />
      </header>

      <!-- Corpo Markdown -->
      <div class="pdf-md__body mt-6" v-html="p.html" />
    </article>
  </template>
</template>

<style scoped>
/*
 * Tipografia editorial v2 aplicada ao conteudo gerado pelo markdown-it.
 * :deep necessario porque o HTML entra via v-html (nao e scoped-friendly).
 *
 * Numeracao de H2 usa CSS counter: gerado pelo renderer sem tocar no Markdown.
 */

.pdf-md__body {
  counter-reset: pdf-h2;
}

/* H2 numerado — numero verde + Anton 30px uppercase, com border-top */
.pdf-md__body :deep(h2) {
  counter-increment: pdf-h2;
  margin:            44px 0 0;
  padding-top:       20px;
  border-top:        1px solid var(--color-border-subtle);
  display:           flex;
  align-items:       baseline;
  gap:               14px;
  font-family:       var(--font-display);
  font-weight:       400;
  font-size:         30px;
  line-height:       1.1;
  letter-spacing:    0.3px;
  text-transform:    uppercase;
  color:             var(--color-fg-default);
}

.pdf-md__body :deep(h2::before) {
  content:     counter(pdf-h2, decimal-leading-zero);
  font-family: var(--font-mono);
  font-size:   13px;
  font-weight: 700;
  color:       var(--color-brand-verde);
  min-width:   28px;
  flex-shrink: 0;
}

/* Links de âncora (markdown-it-anchor) não devem colorir os títulos */
.pdf-md__body :deep(h2 a),
.pdf-md__body :deep(h3 a) { color: inherit; }

/* H3 — Inter 18 600, sem uppercase */
.pdf-md__body :deep(h3) {
  margin:      28px 0 8px;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size:   18px;
  line-height: 1.35;
  color:       var(--color-fg-default);
}

.pdf-md__body :deep(p) {
  margin: 20px 0 0;
  color:  #1F2937;
}

.pdf-md__body :deep(ul),
.pdf-md__body :deep(ol) {
  margin:       20px 0 0;
  padding-left: 22px;
  color:        #1F2937;
}
.pdf-md__body :deep(li)     { margin: 4px 0; }
.pdf-md__body :deep(strong) { color: var(--color-fg-default); font-weight: 600; }
.pdf-md__body :deep(a)      { color: #006E95; text-decoration: none; }

/* Tabelas editoriais v2 — header leve com border-bottom escuro */
.pdf-md__body :deep(table) {
  width:           100%;
  border-collapse: collapse;
  margin:          28px 0 0;
  font-size:       15px;
  line-height:     1.5;
  break-inside:    avoid;
}

.pdf-md__body :deep(thead th) {
  text-align:      left;
  padding:         0 12px 10px 0;
  font-family:     var(--font-mono);
  font-size:       11px;
  font-weight:     700;
  letter-spacing:  2px;
  text-transform:  uppercase;
  color:           #5A6472;
  border-bottom:   1px solid var(--color-fg-default);
  background:      transparent;
}
.pdf-md__body :deep(thead th:not(:first-child)) { padding-left: 12px; }

.pdf-md__body :deep(tbody td) {
  padding:       11px 12px 11px 0;
  border-bottom: 1px solid var(--color-border-subtle);
  color:         #1F2937;
}
.pdf-md__body :deep(tbody td:not(:first-child)) { padding-left: 12px; }

/* Callouts v2 — stripe 3px, label em mono, sem fundo */
.pdf-md__body :deep(aside[data-callout]) {
  margin:         28px 0 0;
  padding:        4px 0 4px 18px;
  border-left:    3px solid var(--color-brand-amarelo);
  background:     transparent;
  display:        flex;
  flex-direction: column;
  gap:            4px;
  break-inside:   avoid;
}
.pdf-md__body :deep(aside[data-callout] > *) { margin: 0; }
.pdf-md__body :deep(aside[data-callout] p) {
  font-size:   16px;
  line-height: 1.6;
  color:       #1F2937;
}

/* Label puxada por ::before, cor e texto variam por tipo */
.pdf-md__body :deep(aside[data-callout]::before) {
  display:        block;
  font-family:    var(--font-mono);
  font-size:      11px;
  font-weight:    700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.pdf-md__body :deep(aside[data-callout="note"])              { border-left-color: #A0AAB4; }
.pdf-md__body :deep(aside[data-callout="note"]::before)      { content: 'Observacao'; color: #4A5568; }
.pdf-md__body :deep(aside[data-callout="tip"])               { border-left-color: var(--color-brand-amarelo); }
.pdf-md__body :deep(aside[data-callout="tip"]::before)       { content: 'Dica';       color: var(--color-fg-default); }
.pdf-md__body :deep(aside[data-callout="warning"])           { border-left-color: var(--color-status-erro); }
.pdf-md__body :deep(aside[data-callout="warning"]::before)   { content: 'Atencao';    color: var(--color-status-erro); }
.pdf-md__body :deep(aside[data-callout="important"])         { border-left-color: var(--color-brand-azul); }
.pdf-md__body :deep(aside[data-callout="important"]::before) { content: 'Importante'; color: var(--color-brand-azul-escuro); }
.pdf-md__body :deep(aside[data-callout="caution"])           { border-left-color: var(--color-status-erro); }
.pdf-md__body :deep(aside[data-callout="caution"]::before)   { content: 'Atencao';    color: var(--color-status-erro); }

/* Caixa "Dica" amarela cheia (v1/v2) */
.pdf-md__body :deep(aside[data-callout="tip"]) {
  padding:     16px 20px;
  border-left: 0;
  background:  var(--color-brand-amarelo);
  flex-direction: row;
  gap:         14px;
  align-items: baseline;
}
.pdf-md__body :deep(aside[data-callout="tip"]::before) { content: '// Dica'; flex-shrink: 0; }
.pdf-md__body :deep(aside[data-callout="tip"] p) { color: var(--color-fg-default); font-weight: 500; }

/* Selos de conceito em tabelas */
.pdf-md__body :deep(.selo) {
  display: inline-block; min-width: 22px; padding: 2px 0; text-align: center;
  font: 700 13px/1.2 var(--font-mono); color: #fff; background: var(--color-brand-verde);
}
.pdf-md__body :deep(.selo-d) { background: var(--color-brand-amarelo); color: var(--color-fg-default); }
.pdf-md__body :deep(.selo-f),
.pdf-md__body :deep(.selo-o) { background: var(--color-status-erro); }
.pdf-md__body :deep(.selo-i) { background: var(--color-border-subtle); color: var(--color-fg-default); }

/* Cartões CR / CA / CP */
.pdf-md__body :deep(.md-cards) {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  margin: 24px 0 0; break-inside: avoid;
}
.pdf-md__body :deep(.md-card) {
  padding: 12px 14px 14px; background: var(--color-bg-surface);
  border-top: 4px solid var(--color-brand-azul);
}
.pdf-md__body :deep(.md-card[data-card="CA"]) { border-top-color: var(--color-brand-verde); }
.pdf-md__body :deep(.md-card[data-card="CP"]) { border-top-color: var(--color-brand-amarelo); }
.pdf-md__body :deep(.md-card p) { margin: 0; }
.pdf-md__body :deep(.md-card__sigla) { font: 400 34px/1.1 var(--font-display); color: var(--color-fg-default); }
.pdf-md__body :deep(.md-card__sub) { margin-top: 6px !important; font: 700 13px/1.3 var(--font-sans); color: var(--color-fg-default); }
.pdf-md__body :deep(.md-card p:last-child:not(.md-card__sigla):not(.md-card__sub)) { margin-top: 6px; font-size: 13px; line-height: 1.5; color: #4A5568; }
</style>
