<script setup lang="ts">
/**
 * MatrizBCTPage.vue — Matriz curricular do BC&T.
 * Rota: /bct/matriz
 *
 * Grade de disciplinas da Formação Geral do Bacharelado em Ciência e Tecnologia
 * organizada por quadrimestre e eixo temático.
 * Códigos em font-mono com tracking amplo para destaque.
 * Cores por eixo: Exatas (azul), Natureza (verde), Humanas (amarelo), Optativa (cinza).
 */

import DocLayout from '@pages/_layouts/DocLayout.vue'
import type { Discipline } from '@entities/course'

// ---------------------------------------------------------------------------
// Tipos auxiliares
// ---------------------------------------------------------------------------

type Eixo = 'exatas' | 'natureza' | 'humanas' | 'optativa'

interface DisciplinaBCT extends Discipline {
  eixo: Eixo
}

interface QuadrimestreBCT {
  /** Número do quadrimestre na grade (1-9) */
  numero:      number
  /** Rótulo exibido (ex: "1º Q") */
  label:       string
  /** Ano (1, 2 ou 3) */
  ano:         number
  disciplinas: DisciplinaBCT[]
}

// ---------------------------------------------------------------------------
// Dados inline — grade do BC&T UFABC (PPC 2013)
// ---------------------------------------------------------------------------
// 9 quadrimestres, 3 por ano.
// Créditos: 1 crédito = 1 hora-aula semanal no quadrimestre (~12 semanas).
// ---------------------------------------------------------------------------

const GRADE: QuadrimestreBCT[] = [
  // 1º ANO
  {
    numero: 1, label: '1º Q', ano: 1,
    disciplinas: [
      { codigo: 'BCM0504-15', nome: 'Bases Computacionais da Ciência',       creditos: 6, quadrimestre: 1, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCM0506-15', nome: 'Bases Matemáticas',                     creditos: 6, quadrimestre: 1, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCN0407-13', nome: 'Bases Conceituais da Energia',          creditos: 6, quadrimestre: 1, ano: 1, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCH0003-15', nome: 'Bases Epistemológicas da Ciência Moderna', creditos: 6, quadrimestre: 1, ano: 1, natureza: 'Obrigatória', eixo: 'humanas'  },
    ],
  },
  {
    numero: 2, label: '2º Q', ano: 1,
    disciplinas: [
      { codigo: 'BCM0505-15', nome: 'Funções de Uma Variável',               creditos: 6, quadrimestre: 2, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCM0507-15', nome: 'Geometria Analítica',                   creditos: 6, quadrimestre: 2, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCN0408-13', nome: 'Estrutura da Matéria',                  creditos: 6, quadrimestre: 2, ano: 1, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCH0004-15', nome: 'Ciência, Tecnologia e Sociedade',       creditos: 6, quadrimestre: 2, ano: 1, natureza: 'Obrigatória', eixo: 'humanas'  },
    ],
  },
  {
    numero: 3, label: '3º Q', ano: 1,
    disciplinas: [
      { codigo: 'BCM0508-15', nome: 'Funções de Várias Variáveis',           creditos: 6, quadrimestre: 3, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCM0509-15', nome: 'Transformações Lineares',               creditos: 6, quadrimestre: 3, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCN0409-13', nome: 'Evolução e Diversificação da Vida',     creditos: 6, quadrimestre: 3, ano: 1, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCH0005-15', nome: 'Bases Conceituais da Física',           creditos: 6, quadrimestre: 3, ano: 1, natureza: 'Obrigatória', eixo: 'exatas'   },
    ],
  },
  // 2º ANO
  {
    numero: 4, label: '4º Q', ano: 2,
    disciplinas: [
      { codigo: 'BCM0510-15', nome: 'Equações Diferenciais Ordinárias',      creditos: 6, quadrimestre: 4, ano: 2, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCM0511-15', nome: 'Probabilidade e Estatística',           creditos: 6, quadrimestre: 4, ano: 2, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCN0410-13', nome: 'Fenômenos Térmicos',                    creditos: 6, quadrimestre: 4, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BIR0603-13', nome: 'Comunicação e Redes',                   creditos: 6, quadrimestre: 4, ano: 2, natureza: 'Obrigatória', eixo: 'exatas'   },
    ],
  },
  {
    numero: 5, label: '5º Q', ano: 2,
    disciplinas: [
      { codigo: 'BCM0512-15', nome: 'Física Quântica',                       creditos: 6, quadrimestre: 5, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCN0411-13', nome: 'Fenômenos Eletromagnéticos',            creditos: 6, quadrimestre: 5, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCN0412-13', nome: 'Transformações Químicas',               creditos: 6, quadrimestre: 5, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BIR0604-13', nome: 'Projeto Dirigido I',                    creditos: 6, quadrimestre: 5, ano: 2, natureza: 'Obrigatória', eixo: 'exatas'   },
    ],
  },
  {
    numero: 6, label: '6º Q', ano: 2,
    disciplinas: [
      { codigo: 'BCN0413-13', nome: 'Mecânica Clássica',                     creditos: 6, quadrimestre: 6, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCN0414-13', nome: 'Bioquímica: Moléculas, Células e Energia', creditos: 6, quadrimestre: 6, ano: 2, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BIR0605-13', nome: 'Projeto Dirigido II',                   creditos: 6, quadrimestre: 6, ano: 2, natureza: 'Obrigatória', eixo: 'exatas'   },
      { codigo: 'BCT0001-13', nome: 'Opção Limitada',                        creditos: 6, quadrimestre: 6, ano: 2, natureza: 'Opção Limitada', eixo: 'optativa' },
    ],
  },
  // 3º ANO
  {
    numero: 7, label: '7º Q', ano: 3,
    disciplinas: [
      { codigo: 'BCN0415-13', nome: 'Fenômenos Ondulatórios e Ótica',        creditos: 6, quadrimestre: 7, ano: 3, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCN0416-13', nome: 'Genômica e Proteômica',                 creditos: 6, quadrimestre: 7, ano: 3, natureza: 'Obrigatória', eixo: 'natureza' },
      { codigo: 'BCT0002-13', nome: 'Opção Limitada',                        creditos: 6, quadrimestre: 7, ano: 3, natureza: 'Opção Limitada', eixo: 'optativa' },
      { codigo: 'BCT0003-13', nome: 'Livre Escolha',                         creditos: 6, quadrimestre: 7, ano: 3, natureza: 'Livre Escolha', eixo: 'optativa' },
    ],
  },
  {
    numero: 8, label: '8º Q', ano: 3,
    disciplinas: [
      { codigo: 'BCH0006-15', nome: 'Comunicação e Expressão',               creditos: 6, quadrimestre: 8, ano: 3, natureza: 'Obrigatória', eixo: 'humanas'  },
      { codigo: 'BIR0606-13', nome: 'Trabalho de Graduação Interdisciplinar I', creditos: 6, quadrimestre: 8, ano: 3, natureza: 'Obrigatória', eixo: 'exatas' },
      { codigo: 'BCT0004-13', nome: 'Opção Limitada',                        creditos: 6, quadrimestre: 8, ano: 3, natureza: 'Opção Limitada', eixo: 'optativa' },
      { codigo: 'BCT0005-13', nome: 'Livre Escolha',                         creditos: 6, quadrimestre: 8, ano: 3, natureza: 'Livre Escolha', eixo: 'optativa' },
    ],
  },
  {
    numero: 9, label: '9º Q', ano: 3,
    disciplinas: [
      { codigo: 'BCH0007-15', nome: 'Responsabilidade Social',               creditos: 6, quadrimestre: 9, ano: 3, natureza: 'Obrigatória', eixo: 'humanas'  },
      { codigo: 'BIR0607-13', nome: 'Trabalho de Graduação Interdisciplinar II', creditos: 6, quadrimestre: 9, ano: 3, natureza: 'Obrigatória', eixo: 'exatas' },
      { codigo: 'BCT0006-13', nome: 'Opção Limitada',                        creditos: 6, quadrimestre: 9, ano: 3, natureza: 'Opção Limitada', eixo: 'optativa' },
      { codigo: 'BCT0007-13', nome: 'Livre Escolha',                         creditos: 6, quadrimestre: 9, ano: 3, natureza: 'Livre Escolha', eixo: 'optativa' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers de estilo por eixo
// ---------------------------------------------------------------------------

function eixoBorderTop(eixo: Eixo): string {
  if (eixo === 'exatas')   return 'border-t-brand-azul'
  if (eixo === 'natureza') return 'border-t-brand-verde'
  if (eixo === 'humanas')  return 'border-t-brand-amarelo'
  return 'border-t-border-strong'
}

function eixoCodigoCls(eixo: Eixo): string {
  if (eixo === 'exatas')   return 'text-brand-azul'
  if (eixo === 'natureza') return 'text-brand-verde'
  if (eixo === 'humanas')  return 'text-brand-amarelo'
  return 'text-fg-muted'
}

function eixoBadgeCls(eixo: Eixo): string {
  if (eixo === 'exatas')   return 'bg-bg-azul-soft text-brand-azul-escuro'
  if (eixo === 'natureza') return 'bg-brand-verde/10 text-brand-verde'
  if (eixo === 'humanas')  return 'bg-brand-amarelo/20 text-fg-default'
  return 'bg-bg-surface text-fg-muted border border-border-subtle'
}

function eixoLabel(eixo: Eixo): string {
  if (eixo === 'exatas')   return 'Exatas'
  if (eixo === 'natureza') return 'Natureza'
  if (eixo === 'humanas')  return 'Humanas'
  return 'Optativa'
}

// Agrupa por ano
const anos = [
  { label: '1º Ano', quadrimestres: GRADE.filter(q => q.ano === 1) },
  { label: '2º Ano', quadrimestres: GRADE.filter(q => q.ano === 2) },
  { label: '3º Ano', quadrimestres: GRADE.filter(q => q.ano === 3) },
]

const totalCreditos = GRADE.flatMap(q => q.disciplinas).reduce((s, d) => s + d.creditos, 0)
</script>

<template>
  <DocLayout
    title="Matriz curricular"
    section="bct"
    parte="Parte 2 · BC&amp;T"
    tema="amarelo"
  >
    <!-- TOC lateral -->
    <template #toc>
      <ul class="list-none m-0 p-0 flex flex-col gap-1">
        <li v-for="ano in anos" :key="ano.label">
          <a
            :href="`#${ano.label.replace(/\s/g, '-').toLowerCase()}`"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            {{ ano.label }}
          </a>
        </li>
        <li>
          <a
            href="#totais"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            Resumo
          </a>
        </li>
      </ul>
    </template>

    <!-- Breadcrumb -->
    <p class="m-0 mb-6 font-mono text-[13px] text-fg-muted">
      <RouterLink to="/" class="text-fg-muted no-underline hover:text-fg-default">Início</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink to="/bct/matriz" class="text-fg-muted no-underline hover:text-fg-default">BC&amp;T</RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-fg-default">Matriz curricular</span>
    </p>

    <!-- Lead -->
    <p class="mt-0 mb-4 text-[19px] text-fg-strong leading-[1.7]">
      O BC&amp;T tem duração de 3 anos (9 quadrimestres) e 2.880 horas-aula de carga
      horária total. As disciplinas estão organizadas em três eixos: Exatas, Ciências da
      Natureza e Humanidades — além das Opções Limitadas e Livre Escolha.
    </p>

    <!-- Legenda de eixos -->
    <section
      aria-label="Legenda de eixos temáticos"
      class="flex flex-wrap gap-3 mb-10"
    >
      <div class="flex items-center gap-2 text-[13px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-brand-azul"></span>
        Exatas
      </div>
      <div class="flex items-center gap-2 text-[13px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-brand-verde"></span>
        Ciências da Natureza
      </div>
      <div class="flex items-center gap-2 text-[13px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-brand-amarelo"></span>
        Humanas
      </div>
      <div class="flex items-center gap-2 text-[13px] font-sans text-fg-strong">
        <span class="inline-block w-3 h-3 rounded-sm bg-bg-surface border border-border-strong"></span>
        Optativa / Livre
      </div>
    </section>

    <!-- Grade por ano -->
    <template v-for="ano in anos" :key="ano.label">
      <section
        :id="ano.label.replace(/\s/g, '-').toLowerCase()"
        :aria-label="ano.label"
        class="mb-14"
      >
        <!-- Cabeçalho do ano -->
        <h2 class="font-display font-normal text-[28px] uppercase tracking-[0.3px] text-fg-default mb-6 mt-0 pb-3 border-b-2 border-fg-default">
          {{ ano.label }}
        </h2>

        <!-- Colunas de quadrimestres -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <template v-for="q in ano.quadrimestres" :key="q.numero">
            <div class="flex flex-col border border-border-subtle rounded-sm overflow-hidden">

              <!-- Cabeçalho do quadrimestre -->
              <div class="bg-fg-default px-4 py-2.5 flex justify-between items-center">
                <span class="font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-on-dark-muted">
                  {{ q.label }}
                </span>
                <span class="font-mono text-[11px] text-fg-on-dark-muted">
                  {{ q.disciplinas.reduce((s, d) => s + d.creditos, 0) }} cr.
                </span>
              </div>

              <!-- Lista de disciplinas -->
              <ul class="list-none m-0 p-0 flex flex-col gap-px bg-border-subtle">
                <template v-for="d in q.disciplinas" :key="d.codigo">
                  <li
                    class="bg-bg-default px-3 py-3 flex flex-col gap-1.5 border-t-[3px]"
                    :class="eixoBorderTop(d.eixo)"
                  >
                    <!-- Código + badge de eixo -->
                    <div class="flex items-start justify-between gap-2">
                      <code
                        class="font-mono text-[11px] font-bold tracking-[1.5px] uppercase shrink-0"
                        :class="eixoCodigoCls(d.eixo)"
                      >
                        {{ d.codigo }}
                      </code>
                      <span
                        class="font-mono text-[9px] font-bold tracking-[1px] uppercase px-1.5 py-0.5 rounded-sm shrink-0"
                        :class="eixoBadgeCls(d.eixo)"
                      >
                        {{ eixoLabel(d.eixo) }}
                      </span>
                    </div>

                    <!-- Nome + créditos -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="font-sans text-[13px] text-fg-strong leading-[1.4] flex-1">
                        {{ d.nome }}
                      </span>
                      <span class="font-mono text-[11px] text-fg-muted shrink-0">
                        {{ d.creditos }}cr
                      </span>
                    </div>

                    <!-- Natureza (quando não for Obrigatória) -->
                    <p
                      v-if="d.natureza !== 'Obrigatória'"
                      class="m-0 font-mono text-[10px] text-fg-muted tracking-[1px] uppercase"
                    >
                      {{ d.natureza }}
                    </p>
                  </li>
                </template>
              </ul>

            </div>
          </template>
        </div>
      </section>
    </template>

    <!-- Totalizador -->
    <section
      id="totais"
      aria-label="Resumo de créditos"
      class="mt-4 p-6 bg-bg-surface border border-border-subtle"
    >
      <p class="font-mono text-[12px] font-bold tracking-[3px] uppercase text-fg-muted mb-4">
        Resumo de créditos
      </p>
      <div class="flex flex-wrap gap-8">
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Obrigatórias</p>
          <p class="font-display text-[32px] leading-none uppercase text-brand-azul">
            {{ GRADE.flatMap(q => q.disciplinas).filter(d => d.natureza === 'Obrigatória').reduce((s, d) => s + d.creditos, 0) }} cr.
          </p>
        </div>
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Opção Limitada</p>
          <p class="font-display text-[32px] leading-none uppercase text-brand-azul-escuro">
            {{ GRADE.flatMap(q => q.disciplinas).filter(d => d.natureza === 'Opção Limitada').reduce((s, d) => s + d.creditos, 0) }} cr.
          </p>
        </div>
        <div>
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Livre Escolha</p>
          <p class="font-display text-[32px] leading-none uppercase text-fg-muted">
            {{ GRADE.flatMap(q => q.disciplinas).filter(d => d.natureza === 'Livre Escolha').reduce((s, d) => s + d.creditos, 0) }} cr.
          </p>
        </div>
        <div class="border-l border-border-strong pl-8">
          <p class="font-mono text-[11px] tracking-[2px] uppercase text-fg-muted mb-1">Total</p>
          <p class="font-display text-[32px] leading-none uppercase text-fg-default">
            {{ totalCreditos }} cr.
          </p>
        </div>
      </div>
    </section>
  </DocLayout>
</template>
