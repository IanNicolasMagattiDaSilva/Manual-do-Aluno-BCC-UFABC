<script setup lang="ts">
/**
 * PdfTabela.vue — Página de comparação entre PPCs do BCC para o PDF.
 * Formato A4 portrait, tabela larga com rótulos de PPCs.
 *
 * Exemplo de uso: diferenças entre PPC 2006, PPC 2016 e PPC 2023.
 *
 * Props:
 *   tema — variante de cor: 'amarelo' | 'azul'
 */

import { PdfFolio } from '@features/pdf-export'
import type { Tema } from '@shared/config/tokens'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

interface PpcCol {
  key:   string
  label: string
  ano:   string
}

const ppcs: PpcCol[] = [
  { key: 'ppc2006', label: 'PPC 2006', ano: 'em vigor até 2015' },
  { key: 'ppc2016', label: 'PPC 2016', ano: 'em vigor 2016–2022' },
  { key: 'ppc2023', label: 'PPC 2023', ano: 'vigente' },
]

interface CompRow {
  aspecto:  string
  ppc2006:  string
  ppc2016:  string
  ppc2023:  string
  destaque: boolean
}

const rows: CompRow[] = [
  {
    aspecto:  'Carga horária total',
    ppc2006:  '3.000 h',
    ppc2016:  '3.040 h',
    ppc2023:  '3.280 h',
    destaque: true,
  },
  {
    aspecto:  'Horas de extensão',
    ppc2006:  'Não exigido',
    ppc2016:  'Não exigido',
    ppc2023:  '328 h (10 %)',
    destaque: true,
  },
  {
    aspecto:  'Disciplinas obrigatórias',
    ppc2006:  '39',
    ppc2016:  '37',
    ppc2023:  '34',
    destaque: false,
  },
  {
    aspecto:  'Disciplinas optativas livres',
    ppc2006:  '5',
    ppc2016:  '7',
    ppc2023:  '9',
    destaque: false,
  },
  {
    aspecto:  'TCC / PGC',
    ppc2006:  'TCC (2 quadrimestres)',
    ppc2016:  'TCC ou PGC',
    ppc2023:  'TCC ou PGC',
    destaque: false,
  },
  {
    aspecto:  'Estágio obrigatório',
    ppc2006:  'Não',
    ppc2016:  'Não',
    ppc2023:  'Não',
    destaque: false,
  },
  {
    aspecto:  'Estágio não-obrigatório (CH optativa)',
    ppc2006:  'Sim',
    ppc2016:  'Sim',
    ppc2023:  'Sim',
    destaque: false,
  },
  {
    aspecto:  'Inglês instrumental',
    ppc2006:  'Obrigatório (2 disc.)',
    ppc2016:  'Obrigatório (1 disc.)',
    ppc2023:  'Optativo',
    destaque: false,
  },
  {
    aspecto:  'Ênfase em computação quântica',
    ppc2006:  '—',
    ppc2016:  '—',
    ppc2023:  'Trilha optativa',
    destaque: true,
  },
  {
    aspecto:  'Créditos em BC&T aproveitados',
    ppc2006:  '72 créditos',
    ppc2016:  '72 créditos',
    ppc2023:  '72 créditos',
    destaque: false,
  },
  {
    aspecto:  'Quadrimestres ideais para conclusão',
    ppc2006:  '12',
    ppc2016:  '12',
    ppc2023:  '13',
    destaque: true,
  },
  {
    aspecto:  'Laboratório de Introdução (LBC)',
    ppc2006:  'Não',
    ppc2016:  'Sim',
    ppc2023:  'Sim',
    destaque: false,
  },
]

interface NoteItem {
  sigla: string
  desc:  string
}

const notas: NoteItem[] = [
  { sigla: 'PGC',  desc: 'Projeto de Graduação em Computação — alternativa ao TCC tradicional.' },
  { sigla: 'BC&T', desc: 'Bacharelado em Ciência e Tecnologia — ciclo básico obrigatório antes do BCC.' },
  { sigla: 'LBC',  desc: 'Laboratório de Bases da Computação (MCTA028).' },
]
</script>

<template>
  <article
    class="max-w-[794px] mx-auto bg-bg-default text-fg-default font-sans text-[11pt] leading-[1.65] box-border px-[64px] pt-[64px] pb-[48px]"
  >
    <!-- Eyebrow -->
    <p class="m-0 mb-2 font-mono text-[8pt] font-bold tracking-[3px] uppercase text-brand-azul">
      Parte 3 · BCC
    </p>

    <!-- Título da seção -->
    <h1
      data-pdf-section
      class="m-0 mb-6 font-display font-normal text-[36pt] leading-[1.05] uppercase text-fg-default"
    >
      Diferenças entre<br>os PPCs
    </h1>

    <!-- Linha decorativa -->
    <div class="w-16 h-1 bg-brand-amarelo mb-6" />

    <!-- Lead paragraph -->
    <p class="m-0 mb-7 text-fg-strong">
      O BCC passou por três versões do Projeto Pedagógico do Curso. A tabela a seguir resume as
      principais diferenças para facilitar a orientação de alunos que ingressaram sob versões
      anteriores e precisam verificar regras de migração ou equivalência de disciplinas.
    </p>

    <!-- Cabeçalho dos PPCs como chips coloridos -->
    <div class="flex gap-3 mb-5 [break-inside:avoid]">
      <template v-for="ppc in ppcs" :key="ppc.key">
        <div
          class="flex flex-col px-4 py-2 border-2 border-border-subtle"
          :class="ppc.key === 'ppc2023' ? 'bg-bg-azul-soft border-brand-azul' : 'bg-bg-surface'"
        >
          <span class="font-mono text-[8pt] font-bold tracking-[2px] uppercase text-brand-azul">
            {{ ppc.label }}
          </span>
          <span class="text-[8.5pt] text-fg-muted">
            {{ ppc.ano }}
          </span>
        </div>
      </template>
    </div>

    <!-- Tabela comparativa -->
    <table class="w-full border-collapse text-[9.5pt] mb-8">
      <thead>
        <tr class="bg-fg-default text-bg-default">
          <th class="text-left px-3 py-[9px] font-mono text-[7.5pt] tracking-[2px] uppercase font-semibold">
            Aspecto
          </th>
          <template v-for="ppc in ppcs" :key="ppc.key + '-th'">
            <th
              class="text-center px-3 py-[9px] font-mono text-[7.5pt] tracking-[2px] uppercase font-semibold w-[140px]"
              :class="ppc.key === 'ppc2023' ? 'text-brand-amarelo' : 'text-bg-default'"
            >
              {{ ppc.label }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, i) in rows" :key="row.aspecto">
          <tr
            :class="[
              '[break-inside:avoid]',
              row.destaque
                ? 'bg-bg-azul-soft'
                : i % 2 === 0 ? 'bg-bg-default' : 'bg-bg-surface',
            ]"
          >
            <td
              class="px-3 py-[8px] border-b border-border-subtle text-fg-strong"
              :class="row.destaque ? 'font-semibold text-fg-default' : ''"
            >
              {{ row.aspecto }}
            </td>
            <td class="px-3 py-[8px] border-b border-border-subtle text-center text-fg-muted">
              {{ row.ppc2006 }}
            </td>
            <td class="px-3 py-[8px] border-b border-border-subtle text-center text-fg-muted">
              {{ row.ppc2016 }}
            </td>
            <td
              class="px-3 py-[8px] border-b border-border-subtle text-center font-semibold text-fg-default"
            >
              {{ row.ppc2023 }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Legenda das siglas -->
    <h2 class="mt-4 mb-3 font-display font-normal text-[13pt] uppercase leading-[1.1] text-fg-default">
      Siglas e referências
    </h2>

    <dl class="m-0 flex flex-col gap-2 mb-8 [break-inside:avoid]">
      <template v-for="nota in notas" :key="nota.sigla">
        <div class="flex gap-3 items-baseline text-[9.5pt]">
          <dt class="font-mono font-bold text-brand-azul shrink-0 w-14">
            {{ nota.sigla }}
          </dt>
          <dd class="m-0 text-fg-muted">
            {{ nota.desc }}
          </dd>
        </div>
      </template>
    </dl>

    <!-- Nota de fonte -->
    <p class="mt-auto mb-8 text-[8.5pt] text-fg-muted border-t border-border-subtle pt-3">
      Fonte: PPCs disponíveis em&nbsp;<span class="font-mono">prograd.ufabc.edu.br</span>.
      Dados consolidados pelo autor; verificar última versão no Projeto Pedagógico oficial.
    </p>

    <!-- Rodapé da folha -->
    <PdfFolio secao="Parte 3 · BCC" num="16" :w="666" />
  </article>
</template>
