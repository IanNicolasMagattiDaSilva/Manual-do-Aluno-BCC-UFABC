<script setup lang="ts">
/**
 * MarkdownPage.vue — Página de documentação gerada a partir de content/*.md.
 *
 * Resolve o arquivo pela rota atual (frontmatter `route`) e renderiza o corpo
 * com markdown-it. É a mesma fonte usada pelo PDF (PdfMarkdownPages), então
 * web e PDF nunca divergem.
 *
 * Para criar uma página nova basta adicionar o .md em content/ e uma rota
 * apontando para este componente em src/app/router.ts.
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DocLayout from '@pages/_layouts/DocLayout.vue'
import { getPageByRoute } from '@shared/lib/content'
import { renderMarkdown } from '@shared/lib/markdown'
import type { Tema } from '@shared/config/tokens'

interface SectionMeta {
  parte: string
  label: string
  root:  string
  tema:  Tema
}

const SECTIONS: Record<string, SectionMeta> = {
  ufabc: { parte: 'Parte 1 · UFABC', label: 'UFABC', root: '/ufabc/campi', tema: 'amarelo' },
  bct:   { parte: 'Parte 2 · BC&T',  label: 'BC&T',  root: '/bct/sobre',   tema: 'amarelo' },
  bcc:   { parte: 'Parte 3 · BCC',   label: 'BCC',   root: '/bcc/sobre',   tema: 'azul'    },
}

const route = useRoute()
const page  = computed(() => getPageByRoute(route.path))
const meta  = computed(() => SECTIONS[page.value?.section ?? ''] ?? SECTIONS['ufabc']!)

/** Corpo sem o H1 inicial (o título já aparece no Hero). */
const body = computed(() => (page.value?.body ?? '').replace(/^\s*#\s+[^\n]*\n+/, ''))

/** Primeiro parágrafo vira lead; o resto é o corpo. */
const parts = computed(() => {
  const trimmed = body.value.trimStart()
  const idx = trimmed.indexOf('\n\n')
  const first = idx < 0 ? trimmed : trimmed.slice(0, idx)
  // Só trata como lead se for um parágrafo comum (não lista, tabela, heading…)
  if (/^([-*+]\s|\d+\.\s|#|>|\|)/.test(first)) return { lead: '', rest: trimmed }
  return { lead: first.trim(), rest: idx < 0 ? '' : trimmed.slice(idx + 2) }
})

const leadHtml = computed(() =>
  parts.value.lead
    ? renderMarkdown(parts.value.lead).trim().replace(/^<p[^>]*>/, '').replace(/<\/p>\s*$/, '')
    : '',
)
const html = computed(() => renderMarkdown(parts.value.rest))
</script>

<template>
  <DocLayout
    :title="page?.title ?? 'Página não encontrada'"
    :parte="meta.parte"
    :section="page?.section ?? 'inicio'"
    :tema="meta.tema"
  >
    <!-- Breadcrumb -->
    <p class="m-0 mb-6 font-mono text-[13px] text-fg-muted">
      <RouterLink to="/" class="text-fg-muted no-underline hover:text-fg-default">Início</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink :to="meta.root" class="text-fg-muted no-underline hover:text-fg-default">{{ meta.label }}</RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-fg-default">{{ page?.title }}</span>
    </p>

    <p
      v-if="leadHtml"
      class="mt-0 mb-8 text-[19px] text-fg-strong leading-[1.7]"
      v-html="leadHtml"
    />

    <div class="md-body" v-html="html" />
  </DocLayout>
</template>

<style scoped>
/*
 * Tipografia do HTML gerado pelo markdown-it. :deep é necessário porque o
 * conteúdo entra via v-html. Espelha as classes usadas nas páginas Vue
 * (h2 Anton 34px, corpo fg-strong 1.7, tabelas com header mono).
 */
.md-body :deep(h2) {
  margin:         48px 0 16px;
  font-family:    var(--font-display);
  font-weight:    400;
  font-size:      34px;
  line-height:    1.1;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color:          var(--color-fg-default);
  scroll-margin-top: 24px;
}
.md-body :deep(h3) {
  margin:      32px 0 8px;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size:   20px;
  line-height: 1.35;
  color:       var(--color-fg-default);
  scroll-margin-top: 24px;
}
.md-body :deep(.header-anchor)       { color: inherit; text-decoration: none; }
.md-body :deep(p)                    { margin: 0 0 16px; color: var(--color-fg-strong); line-height: 1.7; }
.md-body :deep(ul),
.md-body :deep(ol)                   { margin: 0 0 20px; padding-left: 24px; color: var(--color-fg-strong); line-height: 1.7; }
.md-body :deep(li)                   { margin: 6px 0; }
.md-body :deep(li > ul)              { margin: 4px 0 0; }
.md-body :deep(strong)               { color: var(--color-fg-default); font-weight: 600; }
.md-body :deep(a:not(.header-anchor)) { color: var(--color-brand-azul-escuro); }
.md-body :deep(code) {
  font-family:   var(--font-mono);
  font-size:     0.88em;
  padding:       1px 6px;
  background:    var(--color-bg-surface);
  border-radius: 4px;
}

.md-body :deep(table) {
  display:         block;
  overflow-x:      auto;
  width:           100%;
  border-collapse: collapse;
  margin:          8px 0 28px;
  font-size:       15px;
  line-height:     1.5;
}
.md-body :deep(thead th) {
  text-align:     left;
  padding:        12px 16px 12px 0;
  font-family:    var(--font-mono);
  font-size:      12px;
  font-weight:    400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color:          var(--color-fg-muted);
  border-bottom:  1px solid var(--color-border-strong);
}
.md-body :deep(tbody td) {
  padding:        10px 16px 10px 0;
  border-bottom:  1px solid var(--color-border-subtle);
  color:          var(--color-fg-strong);
  vertical-align: top;
}

.md-body :deep(aside[data-callout]) {
  margin:        24px 0;
  padding:       16px 20px;
  border-left:   4px solid var(--color-brand-azul-escuro);
  background:    var(--color-bg-azul-soft);
  border-radius: 0 6px 6px 0;
}
.md-body :deep(aside[data-callout] p:last-child) { margin-bottom: 0; }
.md-body :deep(aside[data-callout]::before) {
  display:        block;
  margin-bottom:  6px;
  font-family:    var(--font-mono);
  font-size:      12px;
  font-weight:    700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color:          var(--color-brand-azul-escuro);
}
.md-body :deep(aside[data-callout="note"]::before)      { content: 'Observação'; }
.md-body :deep(aside[data-callout="tip"])               { border-left-color: var(--color-brand-amarelo); background: #FFF8DB; }
.md-body :deep(aside[data-callout="tip"]::before)       { content: 'Dica'; color: var(--color-fg-default); }
.md-body :deep(aside[data-callout="important"]::before) { content: 'Importante'; }
.md-body :deep(aside[data-callout="warning"]),
.md-body :deep(aside[data-callout="caution"])           { border-left-color: var(--color-status-erro); background: #FCEDEC; }
.md-body :deep(aside[data-callout="warning"]::before),
.md-body :deep(aside[data-callout="caution"]::before)   { content: 'Atenção'; color: var(--color-status-erro); }

/* Elementos editoriais: selos de conceito e cartões */
.md-body :deep(.selo) { display: inline-block; min-width: 22px; padding: 2px 0; text-align: center; font: 700 13px/1.2 var(--font-mono); color: #fff; background: var(--color-brand-verde); }
.md-body :deep(.selo-d) { background: var(--color-brand-amarelo); color: var(--color-fg-default); }
.md-body :deep(.selo-f), .md-body :deep(.selo-o) { background: var(--color-status-erro); }
.md-body :deep(.selo-i) { background: var(--color-border-subtle); color: var(--color-fg-default); }
.md-body :deep(.md-cards) { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
.md-body :deep(.md-card) { padding: 12px 14px 14px; background: var(--color-bg-surface); border-top: 4px solid var(--color-brand-azul); }
.md-body :deep(.md-card[data-card="CA"]) { border-top-color: var(--color-brand-verde); }
.md-body :deep(.md-card[data-card="CP"]) { border-top-color: var(--color-brand-amarelo); }
.md-body :deep(.md-card p) { margin: 0; }
.md-body :deep(.md-card__sigla) { font: 400 34px/1.1 var(--font-display); }
.md-body :deep(.md-card__sub) { margin: 6px 0 !important; font-weight: 700; }
</style>
