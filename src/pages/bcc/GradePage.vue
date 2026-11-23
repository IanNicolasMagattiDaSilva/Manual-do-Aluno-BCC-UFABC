<script setup lang="ts">
/**
 * GradePage.vue — Grade curricular do BCC.
 * Rota: /bcc/grade
 *
 * Exibe a matriz de disciplinas por quadrimestre, agrupada em anos.
 * Natureza: obrigatoria (azul) | opcao-limitada (amarelo) | livre (cinza).
 * Códigos de disciplina em font-mono.
 */

import type { BCCDiscipline, BCCTerm } from '@entities/course'
import DocLayout from '@pages/_layouts/DocLayout.vue'

// ---------------------------------------------------------------------------
// Dados inline — grade do BCC UFABC (PPC 2017)
// ---------------------------------------------------------------------------

const TERMS: BCCTerm[] = [
  // 1º Ano
  {
    term: 1,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA001-15', name: 'Bases Computacionais da Ciência',       credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA002-15', name: 'Processamento da Informação',           credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB001-15', name: 'Funções de Uma Variável',               credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB002-15', name: 'Geometria Analítica',                   credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB003-15', name: 'Física Experimental I',                 credits: 3, nature: 'obrigatoria' },
      { code: 'MCTB004-15', name: 'Transformações Químicas',               credits: 3, nature: 'obrigatoria' },
      { code: 'MCTB005-15', name: 'Bioquímica: Moléculas, Células e Energia', credits: 3, nature: 'obrigatoria' },
      { code: 'MCTB006-15', name: 'Estrutura da Matéria',                  credits: 3, nature: 'obrigatoria' },
    ],
  },
  {
    term: 2,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA003-15', name: 'Lógica de Programação',                 credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA004-15', name: 'Estruturas de Dados',                   credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB007-15', name: 'Funções de Várias Variáveis',           credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB008-15', name: 'Equações Diferenciais Ordinárias',      credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB009-15', name: 'Física I',                              credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB010-15', name: 'Probabilidade e Estatística',           credits: 6, nature: 'obrigatoria' },
    ],
  },
  {
    term: 3,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA005-15', name: 'Álgebra Linear',                        credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA006-15', name: 'Matemática Discreta',                   credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA007-15', name: 'Análise de Algoritmos',                 credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB011-15', name: 'Física II',                             credits: 6, nature: 'obrigatoria' },
      { code: 'MCTB012-15', name: 'Física Experimental II',                credits: 3, nature: 'obrigatoria' },
      { code: 'ESTO013-17', name: 'Estudo e Aplicações em BCC I',          credits: 3, nature: 'opcao-limitada' },
      { code: 'ESTO014-17', name: 'Estudo e Aplicações em BCC II',         credits: 3, nature: 'opcao-limitada' },
      { code: 'ESTB015-17', name: 'Estudo e Aplicações em BCC III',        credits: 3, nature: 'opcao-limitada' },
    ],
  },
  // 2º Ano
  {
    term: 4,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA008-15', name: 'Arquitetura de Computadores',           credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA009-15', name: 'Linguagens de Programação',             credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA010-15', name: 'Compiladores',                         credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA011-15', name: 'Banco de Dados',                       credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA012-15', name: 'Teoria da Computação',                 credits: 6, nature: 'obrigatoria' },
      { code: 'ESTB016-17', name: 'Opção Limitada I',                     credits: 6, nature: 'opcao-limitada' },
    ],
  },
  {
    term: 5,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA013-15', name: 'Redes de Computadores',                credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA014-15', name: 'Sistemas Operacionais',                credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA015-15', name: 'Engenharia de Software',               credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA016-15', name: 'Inteligência Artificial',              credits: 6, nature: 'obrigatoria' },
      { code: 'ESTB017-17', name: 'Opção Limitada II',                    credits: 6, nature: 'opcao-limitada' },
      { code: 'ESTB018-17', name: 'Opção Limitada III',                   credits: 6, nature: 'opcao-limitada' },
    ],
  },
  {
    term: 6,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA017-15', name: 'Computação Gráfica',                   credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA018-15', name: 'Segurança de Computadores',            credits: 6, nature: 'obrigatoria' },
      { code: 'ESTB019-17', name: 'Opção Limitada IV',                    credits: 6, nature: 'opcao-limitada' },
      { code: 'ESTB020-17', name: 'Opção Limitada V',                     credits: 6, nature: 'opcao-limitada' },
      { code: 'LIVB001-17', name: 'Livre Escolha I',                      credits: 6, nature: 'livre' },
      { code: 'LIVB002-17', name: 'Livre Escolha II',                     credits: 6, nature: 'livre' },
    ],
  },
  // 3º Ano
  {
    term: 7,
    totalCredits: 36,
    disciplines: [
      { code: 'MCTA019-15', name: 'Projeto de Graduação I (PGC/TCC)',     credits: 6, nature: 'obrigatoria' },
      { code: 'MCTA020-15', name: 'Estágio Supervisionado',               credits: 6, nature: 'obrigatoria' },
      { code: 'ESTB021-17', name: 'Opção Limitada VI',                    credits: 6, nature: 'opcao-limitada' },
      { code: 'ESTB022-17', name: 'Opção Limitada VII',                   credits: 6, nature: 'opcao-limitada' },
      { code: 'LIVB003-17', name: 'Livre Escolha III',                    credits: 6, nature: 'livre' },
      { code: 'LIVB004-17', name: 'Livre Escolha IV',                     credits: 6, nature: 'livre' },
    ],
  },
  {
    term: 8,
    totalCredits: 24,
    disciplines: [
      { code: 'MCTA021-15', name: 'Projeto de Graduação II (PGC/TCC)',    credits: 6, nature: 'obrigatoria' },
      { code: 'ESTB023-17', name: 'Opção Limitada VIII',                  credits: 6, nature: 'opcao-limitada' },
      { code: 'LIVB005-17', name: 'Livre Escolha V',                      credits: 6, nature: 'livre' },
      { code: 'LIVB006-17', name: 'Livre Escolha VI',                     credits: 6, nature: 'livre' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Agrupa os quadrimestres em anos (3 termos por ano) */
const years = [
  { label: '1º Ano', terms: TERMS.slice(0, 3) },
  { label: '2º Ano', terms: TERMS.slice(3, 6) },
  { label: '3º Ano', terms: TERMS.slice(6, 8) },
]

function natureBg(nature: BCCDiscipline['nature']): string {
  if (nature === 'obrigatoria')   return 'bg-bg-azul-soft border-l-4 border-brand-azul'
  if (nature === 'opcao-limitada') return 'bg-brand-amarelo/10 border-l-4 border-brand-amarelo'
  return 'bg-bg-surface border-l-4 border-border-strong'
}

function natureBadgeCls(nature: BCCDiscipline['nature']): string {
  if (nature === 'obrigatoria')   return 'bg-brand-azul text-fg-on-azul'
  if (nature === 'opcao-limitada') return 'bg-brand-amarelo text-fg-default'
  return 'bg-bg-surface text-fg-muted border border-border-strong'
}

function natureLabel(nature: BCCDiscipline['nature']): string {
  if (nature === 'obrigatoria')    return 'Obrig.'
  if (nature === 'opcao-limitada') return 'Op. Lim.'
  return 'Livre'
}
</script>

<template>
  <DocLayout
    title="Grade curricular"
    section="bcc"
    parte="Parte 3 · BCC"
    tema="azul"
  >

    <!-- Legenda -->
    <section aria-label="Legenda de natureza das disciplinas" class="flex flex-wrap gap-4 mb-8">
      <div class="flex items-center gap-2 text-[14px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-brand-azul"></span>
        Obrigatória
      </div>
      <div class="flex items-center gap-2 text-[14px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-brand-amarelo"></span>
        Opção Limitada
      </div>
      <div class="flex items-center gap-2 text-[14px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-bg-surface border border-border-strong"></span>
        Livre Escolha
      </div>
    </section>

    <!-- Grade por ano -->
    <template v-for="year in years" :key="year.label">
      <section :aria-label="year.label" class="mb-12">

        <!-- Cabeçalho do ano -->
        <h2 class="font-display font-normal text-[28px] uppercase tracking-[0.3px] text-fg-default mb-6 mt-0 pb-3 border-b border-border-subtle">
          {{ year.label }}
        </h2>

        <!-- Grade de quadrimestres -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-for="t in year.terms" :key="t.term">
            <div class="flex flex-col gap-0 border border-border-subtle rounded-sm overflow-hidden">

              <!-- Cabeçalho do quadrimestre -->
              <div class="bg-fg-default text-bg-default px-4 py-2 flex justify-between items-center">
                <span class="font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-on-dark-muted">
                  {{ t.term }}º Quadrimestre
                </span>
                <span class="font-mono text-[11px] text-fg-on-dark-muted">
                  {{ t.totalCredits }} cr.
                </span>
              </div>

              <!-- Lista de disciplinas -->
              <ul class="list-none m-0 p-0 flex-1 flex flex-col gap-px bg-border-subtle">
                <template v-for="d in t.disciplines" :key="d.code">
                  <li :class="['px-3 py-2.5 flex flex-col gap-1', natureBg(d.nature)]">
                    <!-- Código + badge de natureza -->
                    <div class="flex items-center justify-between gap-2">
                      <code class="font-mono text-[11px] text-fg-muted tracking-[0.5px]">{{ d.code }}</code>
                      <span :class="['font-mono text-[10px] font-bold tracking-[1px] uppercase px-1.5 py-0.5 rounded-sm shrink-0', natureBadgeCls(d.nature)]">
                        {{ natureLabel(d.nature) }}
                      </span>
                    </div>
                    <!-- Nome + créditos -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="font-sans text-[13px] text-fg-strong leading-[1.4] flex-1">{{ d.name }}</span>
                      <span class="font-mono text-[11px] text-fg-muted shrink-0">{{ d.credits }}cr</span>
                    </div>
                  </li>
                </template>
              </ul>

            </div>
          </template>
        </div>
      </section>
    </template>

    <!-- Totalizador -->
    <section aria-label="Totais da grade" class="mt-4 p-6 bg-bg-surface border border-border-subtle">
      <p class="font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-muted mb-4">
        Resumo de créditos
      </p>
      <div class="flex flex-wrap gap-8">
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Obrigatórias</p>
          <p class="font-display text-[32px] leading-none uppercase text-brand-azul">
            {{ TERMS.flatMap(t => t.disciplines).filter(d => d.nature === 'obrigatoria').reduce((s, d) => s + d.credits, 0) }} cr.
          </p>
        </div>
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Opção Limitada</p>
          <p class="font-display text-[32px] leading-none uppercase text-brand-azul-escuro">
            {{ TERMS.flatMap(t => t.disciplines).filter(d => d.nature === 'opcao-limitada').reduce((s, d) => s + d.credits, 0) }} cr.
          </p>
        </div>
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Livre Escolha</p>
          <p class="font-display text-[32px] leading-none uppercase text-fg-muted">
            {{ TERMS.flatMap(t => t.disciplines).filter(d => d.nature === 'livre').reduce((s, d) => s + d.credits, 0) }} cr.
          </p>
        </div>
        <div class="border-l border-border-strong pl-8">
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Total</p>
          <p class="font-display text-[32px] leading-none uppercase text-fg-default">
            {{ TERMS.flatMap(t => t.disciplines).reduce((s, d) => s + d.credits, 0) }} cr.
          </p>
        </div>
      </div>
    </section>

    <!-- Prev / next -->
    <template #prevnext>
      <nav aria-label="Navegação entre páginas" class="mt-16 flex justify-between gap-4 border-t border-border-subtle pt-8">
        <RouterLink
          to="/bcc/grade"
          class="flex flex-col gap-1 no-underline text-fg-muted hover:text-fg-default group"
        >
          <span class="font-mono text-[11px] tracking-[2px] uppercase">Anterior</span>
          <span class="font-sans text-[15px] font-semibold text-fg-default group-hover:text-brand-azul-escuro">O que é o BCC</span>
        </RouterLink>
        <RouterLink
          to="/bcc/ppc"
          class="flex flex-col gap-1 no-underline text-right text-fg-muted hover:text-fg-default group"
        >
          <span class="font-mono text-[11px] tracking-[2px] uppercase">Próxima</span>
          <span class="font-sans text-[15px] font-semibold text-fg-default group-hover:text-brand-azul-escuro">Diferenças entre os PPCs</span>
        </RouterLink>
      </nav>
    </template>

  </DocLayout>
</template>
