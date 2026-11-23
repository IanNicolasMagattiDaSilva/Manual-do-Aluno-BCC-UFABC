<script setup lang="ts">
/**
 * PPCPage.vue — Comparação entre os PPCs do BCC.
 * Rota: /bcc/ppc
 *
 * Tabela real (<table>) comparando aspectos do PPC 2006, PPC 2011 e PPC 2017.
 * Primeira coluna: aspecto. Demais colunas: valor por versão do PPC.
 */

import type { PPCVersion, PPCDifference } from '@entities/course'
import DocLayout from '@pages/_layouts/DocLayout.vue'

// ---------------------------------------------------------------------------
// Dados inline
// ---------------------------------------------------------------------------

const VERSIONS: PPCVersion[] = [
  { label: 'PPC 2006', year: 2006 },
  { label: 'PPC 2011', year: 2011 },
  { label: 'PPC 2017', year: 2017 },
]

const DIFFERENCES: PPCDifference[] = [
  {
    aspect: 'Vigência',
    values: {
      'PPC 2006': '2006–2010',
      'PPC 2011': '2011–2016',
      'PPC 2017': '2017–atual',
    },
  },
  {
    aspect: 'Carga horária total',
    values: {
      'PPC 2006': '3.600 h',
      'PPC 2011': '3.600 h',
      'PPC 2017': '3.600 h',
    },
  },
  {
    aspect: 'Créditos totais',
    values: {
      'PPC 2006': '240 cr.',
      'PPC 2011': '240 cr.',
      'PPC 2017': '240 cr.',
    },
  },
  {
    aspect: 'Duração mínima',
    values: {
      'PPC 2006': '8 quadrimestres',
      'PPC 2011': '8 quadrimestres',
      'PPC 2017': '8 quadrimestres',
    },
  },
  {
    aspect: 'Duração máxima',
    values: {
      'PPC 2006': '16 quadrimestres',
      'PPC 2011': '16 quadrimestres',
      'PPC 2017': '16 quadrimestres',
    },
  },
  {
    aspect: 'Disciplinas obrigatórias (BCC)',
    values: {
      'PPC 2006': '30 disciplinas',
      'PPC 2011': '28 disciplinas',
      'PPC 2017': '24 disciplinas',
    },
    note: 'Redução gradual das obrigatórias com aumento de Opções Limitadas.',
  },
  {
    aspect: 'Opções Limitadas',
    values: {
      'PPC 2006': '8 disciplinas',
      'PPC 2011': '10 disciplinas',
      'PPC 2017': '8 disciplinas',
    },
  },
  {
    aspect: 'Livre Escolha',
    values: {
      'PPC 2006': '36 cr.',
      'PPC 2011': '36 cr.',
      'PPC 2017': '36 cr.',
    },
  },
  {
    aspect: 'Estágio obrigatório',
    values: {
      'PPC 2006': 'Não',
      'PPC 2011': 'Não',
      'PPC 2017': 'Sim (6 cr.)',
    },
    note: 'O PPC 2017 tornou o estágio componente curricular obrigatório.',
  },
  {
    aspect: 'PGC / TCC',
    values: {
      'PPC 2006': '2 disciplinas (12 cr.)',
      'PPC 2011': '2 disciplinas (12 cr.)',
      'PPC 2017': '2 disciplinas (12 cr.)',
    },
  },
  {
    aspect: 'Integralização com BC&T',
    values: {
      'PPC 2006': 'Disciplinas do BC&T contam como OL ou LE',
      'PPC 2011': 'Disciplinas do BC&T contam como OL ou LE',
      'PPC 2017': 'Disciplinas do BC&T contam como OL ou LE',
    },
  },
  {
    aspect: 'Ênfases / perfis',
    values: {
      'PPC 2006': 'Sem ênfases formais',
      'PPC 2011': 'Sem ênfases formais',
      'PPC 2017': 'Sem ênfases formais',
    },
    note: 'A flexibilidade é obtida via escolha das OLs e disciplinas livres.',
  },
  {
    aspect: 'Reconhecimento pelo MEC',
    values: {
      'PPC 2006': 'Sim',
      'PPC 2011': 'Sim',
      'PPC 2017': 'Sim',
    },
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retorna classes para célula de dado.
 * Destaca a coluna do PPC mais recente (2017).
 */
function cellCls(version: PPCVersion): string {
  return version.year === 2017
    ? 'bg-bg-azul-soft text-fg-default font-semibold'
    : 'bg-bg-default text-fg-strong'
}
</script>

<template>
  <DocLayout
    title="Diferenças entre os PPCs"
    section="bcc"
    parte="Parte 3 · BCC"
    tema="azul"
  >
    <!-- Introdução -->
    <p class="font-sans text-[18px] text-fg-strong mb-8 mt-0 leading-[1.6]">
      O BCC da UFABC já passou por três versões do seu Projeto Pedagógico do Curso (PPC).
      A tabela abaixo resume as principais diferenças entre elas. Alunos ingressantes a
      partir de 2017 seguem o PPC vigente; os demais podem verificar seu PPC de ingresso
      no SIGAA.
    </p>

    <!-- Destaque PPC atual -->
    <div
      class="flex items-center gap-3 mb-8 p-4 bg-bg-azul-soft border-l-4 border-brand-azul"
      role="note"
      aria-label="PPC vigente"
    >
      <span class="font-mono text-[12px] font-bold tracking-[3px] uppercase text-brand-azul-escuro shrink-0">
        Vigente
      </span>
      <p class="font-sans text-[14px] text-fg-strong m-0">
        O <strong class="text-fg-default">PPC 2017</strong> é o projeto pedagógico atual do BCC.
        As colunas destacadas em azul correspondem a ele.
      </p>
    </div>

    <!-- Tabela comparativa -->
    <div class="overflow-x-auto -mx-0 mb-12">
      <table class="w-full border-collapse font-sans text-[14px] min-w-[560px]">
        <thead>
          <tr class="border-b-2 border-border-strong">
            <th
              scope="col"
              class="text-left py-3 pr-4 pl-0 font-mono text-[11px] font-bold tracking-[2px] uppercase text-fg-muted w-[200px]"
            >
              Aspecto
            </th>
            <template v-for="v in VERSIONS" :key="v.label">
              <th
                scope="col"
                :class="[
                  'text-left py-3 px-4 font-mono text-[11px] font-bold tracking-[2px] uppercase',
                  v.year === 2017
                    ? 'text-brand-azul-escuro bg-bg-azul-soft'
                    : 'text-fg-muted',
                ]"
              >
                {{ v.label }}
                <span
                  v-if="v.year === 2017"
                  class="ml-2 font-mono text-[9px] tracking-[1px] uppercase px-1.5 py-0.5 bg-brand-azul text-bg-default rounded-sm"
                  aria-label="PPC vigente"
                >
                  Atual
                </span>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(diff, idx) in DIFFERENCES" :key="diff.aspect">
            <tr
              :class="[
                'border-b border-border-subtle align-top',
                idx % 2 === 0 ? 'bg-bg-default' : 'bg-bg-surface',
              ]"
            >
              <!-- Coluna de aspecto -->
              <th
                scope="row"
                class="text-left py-3 pr-4 pl-0 font-sans text-[14px] font-semibold text-fg-default align-top"
              >
                {{ diff.aspect }}
                <span
                  v-if="diff.note"
                  class="block font-normal text-[12px] text-fg-muted mt-1 leading-[1.4]"
                >
                  {{ diff.note }}
                </span>
              </th>

              <!-- Colunas de valor por versão -->
              <template v-for="v in VERSIONS" :key="v.label">
                <td
                  :class="[
                    'py-3 px-4 align-top leading-[1.5]',
                    cellCls(v),
                  ]"
                >
                  {{ diff.values[v.label] ?? '—' }}
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Nota de rodapé -->
    <p class="font-sans text-[13px] text-fg-muted leading-[1.5]">
      Fontes: Resoluções do Conselho de Ensino, Pesquisa e Extensão (ConsEPE) da UFABC.
      Consulte o
      <a
        href="https://www.ufabc.edu.br/administracao/conselhos/consepe"
        target="_blank"
        rel="noopener noreferrer"
        class="text-brand-azul-escuro underline hover:text-brand-azul"
      >
        site oficial do ConsEPE
      </a>
      para os documentos completos de cada PPC.
    </p>

    <!-- Prev / next -->
    <template #prevnext>
      <nav aria-label="Navegação entre páginas" class="mt-16 flex justify-between gap-4 border-t border-border-subtle pt-8">
        <RouterLink
          to="/bcc/grade"
          class="flex flex-col gap-1 no-underline text-fg-muted hover:text-fg-default group"
        >
          <span class="font-mono text-[11px] tracking-[2px] uppercase">Anterior</span>
          <span class="font-sans text-[15px] font-semibold text-fg-default group-hover:text-brand-azul-escuro">Grade curricular</span>
        </RouterLink>
        <RouterLink
          to="/bcc/ppc"
          class="flex flex-col gap-1 no-underline text-right text-fg-muted hover:text-fg-default group"
        >
          <span class="font-mono text-[11px] tracking-[2px] uppercase">Próxima</span>
          <span class="font-sans text-[15px] font-semibold text-fg-default group-hover:text-brand-azul-escuro">Estágio</span>
        </RouterLink>
      </nav>
    </template>

  </DocLayout>
</template>
