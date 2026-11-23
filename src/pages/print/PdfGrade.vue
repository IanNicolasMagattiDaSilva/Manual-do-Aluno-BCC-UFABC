<script setup lang="ts">
/**
 * PdfGrade.vue — Grade curricular do BCC em A4 paisagem (landscape).
 * Orientação landscape marcada com data-orientation="landscape" na raiz.
 * O print.css trata a quebra de página e @page landscape.
 *
 * Fonte dos dados: PPC BCC 2023, Anexo I — Grade Curricular.
 *
 * Props:
 *   tema — variante de cor: 'amarelo' | 'azul'
 */

import { computed } from 'vue'
import { PdfFolio } from '@features/pdf-export'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

const t = computed(() => themes[props.tema])

/** Número de quadrimestres exibidos */
const QUADS = 13

type Tipo = 'obrig' | 'optativa' | 'extensao' | 'tcc'

interface Disciplina {
  codigo:    string
  nome:      string
  cred:      number
  tipo:      Tipo
  quad:      number  // 1–13
}

/** Grade BCC PPC 2023 — disciplinas obrigatórias e marcos principais */
const disciplinas: Disciplina[] = [
  // Q1
  { codigo: 'MCTA001', nome: 'Bases Computacionais da Ciência',       cred: 3, tipo: 'obrig',    quad: 1  },
  { codigo: 'MCTA028', nome: 'Laboratório de Bases da Computação',    cred: 3, tipo: 'obrig',    quad: 1  },
  { codigo: 'MCSB001', nome: 'Bases Matemáticas',                     cred: 6, tipo: 'obrig',    quad: 1  },
  // Q2
  { codigo: 'MCTA002', nome: 'Processamento da Informação',           cred: 3, tipo: 'obrig',    quad: 2  },
  { codigo: 'MCSB006', nome: 'Funções de Uma Variável',               cred: 6, tipo: 'obrig',    quad: 2  },
  // Q3
  { codigo: 'MCTA003', nome: 'Programação Estruturada',               cred: 6, tipo: 'obrig',    quad: 3  },
  { codigo: 'MCSB014', nome: 'Geometria Analítica',                   cred: 4, tipo: 'obrig',    quad: 3  },
  // Q4 — início BCC (após BC&T)
  { codigo: 'MCCC001', nome: 'Algoritmos e Estruturas de Dados I',    cred: 6, tipo: 'obrig',    quad: 4  },
  { codigo: 'MCCC002', nome: 'Lógica de Programação',                 cred: 6, tipo: 'obrig',    quad: 4  },
  { codigo: 'MCCC003', nome: 'Matemática Discreta',                   cred: 6, tipo: 'obrig',    quad: 4  },
  // Q5
  { codigo: 'MCCC004', nome: 'Algoritmos e Estruturas de Dados II',   cred: 6, tipo: 'obrig',    quad: 5  },
  { codigo: 'MCCC005', nome: 'Linguagens Formais e Autômatos',        cred: 6, tipo: 'obrig',    quad: 5  },
  { codigo: 'MCCC006', nome: 'Sistemas Digitais',                     cred: 6, tipo: 'obrig',    quad: 5  },
  // Q6
  { codigo: 'MCCC007', nome: 'Projeto e Análise de Algoritmos',       cred: 6, tipo: 'obrig',    quad: 6  },
  { codigo: 'MCCC008', nome: 'Arquitetura de Computadores',           cred: 6, tipo: 'obrig',    quad: 6  },
  { codigo: 'MCCC009', nome: 'Banco de Dados',                        cred: 6, tipo: 'obrig',    quad: 6  },
  // Q7
  { codigo: 'MCCC010', nome: 'Sistemas Operacionais',                 cred: 6, tipo: 'obrig',    quad: 7  },
  { codigo: 'MCCC011', nome: 'Redes de Computadores',                 cred: 6, tipo: 'obrig',    quad: 7  },
  { codigo: 'MCCC012', nome: 'Inteligência Artificial',               cred: 6, tipo: 'obrig',    quad: 7  },
  // Q8
  { codigo: 'MCCC013', nome: 'Compiladores',                          cred: 6, tipo: 'obrig',    quad: 8  },
  { codigo: 'MCCC014', nome: 'Engenharia de Software',                cred: 6, tipo: 'obrig',    quad: 8  },
  { codigo: 'MCCC015', nome: 'Computação Gráfica',                    cred: 6, tipo: 'obrig',    quad: 8  },
  // Q9
  { codigo: 'MCCC016', nome: 'Segurança Computacional',               cred: 6, tipo: 'obrig',    quad: 9  },
  { codigo: 'MCCC017', nome: 'Optativa I',                            cred: 6, tipo: 'optativa', quad: 9  },
  { codigo: 'MCCC018', nome: 'Extensão I',                            cred: 4, tipo: 'extensao', quad: 9  },
  // Q10
  { codigo: 'MCCC019', nome: 'Optativa II',                           cred: 6, tipo: 'optativa', quad: 10 },
  { codigo: 'MCCC020', nome: 'Optativa III',                          cred: 6, tipo: 'optativa', quad: 10 },
  { codigo: 'MCCC021', nome: 'Extensão II',                           cred: 4, tipo: 'extensao', quad: 10 },
  // Q11
  { codigo: 'MCCC022', nome: 'Optativa IV',                           cred: 6, tipo: 'optativa', quad: 11 },
  { codigo: 'MCCC023', nome: 'Optativa V',                            cred: 6, tipo: 'optativa', quad: 11 },
  { codigo: 'MCCC024', nome: 'Extensão III',                          cred: 4, tipo: 'extensao', quad: 11 },
  // Q12
  { codigo: 'MCCC025', nome: 'Optativa VI',                           cred: 6, tipo: 'optativa', quad: 12 },
  { codigo: 'MCCC026', nome: 'Optativa VII',                          cred: 6, tipo: 'optativa', quad: 12 },
  { codigo: 'MCCC027', nome: 'Extensão IV',                           cred: 4, tipo: 'extensao', quad: 12 },
  // Q13
  { codigo: 'MCCC028', nome: 'PGC / TCC I',                           cred: 6, tipo: 'tcc',      quad: 13 },
  { codigo: 'MCCC029', nome: 'PGC / TCC II',                          cred: 6, tipo: 'tcc',      quad: 13 },
  { codigo: 'MCCC030', nome: 'Extensão V',                            cred: 4, tipo: 'extensao', quad: 13 },
]

/** Disciplinas agrupadas por quadrimestre */
const porQuad = computed(() => {
  const mapa = new Map<number, Disciplina[]>()
  for (let q = 1; q <= QUADS; q++) mapa.set(q, [])
  for (const d of disciplinas) {
    mapa.get(d.quad)!.push(d)
  }
  return mapa
})

const quads = computed(() => Array.from({ length: QUADS }, (_, i) => i + 1))

/** Total de créditos BCC (Q4–Q13) */
const totalCredsBcc = computed(() =>
  disciplinas
    .filter(d => d.quad >= 4)
    .reduce((s, d) => s + d.cred, 0),
)

type TipoCls = Record<Tipo, string>
const tipoCls: TipoCls = {
  obrig:    'bg-bg-azul-soft border-l-4 border-brand-azul',
  optativa: 'bg-bg-surface   border-l-4 border-brand-azul-claro',
  extensao: 'bg-bg-default   border-l-4 border-brand-verde',
  tcc:      'bg-bg-default   border-l-4 border-brand-azul-escuro',
}

type LegItem = { tipo: Tipo; label: string }
const legenda: LegItem[] = [
  { tipo: 'obrig',    label: 'Obrigatória BCC' },
  { tipo: 'optativa', label: 'Optativa livre' },
  { tipo: 'extensao', label: 'Extensão' },
  { tipo: 'tcc',      label: 'TCC / PGC' },
]
</script>

<template>
  <!-- data-orientation="landscape" → print.css aplica @page landscape a esta seção -->
  <article
    data-orientation="landscape"
    class="max-w-[1123px] mx-auto bg-bg-default text-fg-default font-sans text-[9pt] leading-[1.5] box-border px-[56px] pt-[48px] pb-[40px]"
  >
    <!-- Cabeçalho da página -->
    <div class="flex items-end justify-between mb-5">
      <div>
        <p class="m-0 mb-1 font-mono text-[7pt] font-bold tracking-[3px] uppercase text-brand-azul">
          Parte 3 · BCC
        </p>
        <h1
          data-pdf-section
          class="m-0 font-display font-normal text-[28pt] leading-[1.0] uppercase text-fg-default"
        >
          Grade Curricular BCC — PPC 2023
        </h1>
      </div>
      <div class="text-right">
        <p class="m-0 font-mono text-[8pt] text-fg-muted">
          Total BCC (Q4–Q13): <strong class="text-fg-default">{{ totalCredsBcc }} créditos</strong>
        </p>
        <p class="m-0 font-mono text-[7.5pt] text-fg-muted">
          13 quadrimestres ideais · inclui BC&amp;T (Q1–Q3)
        </p>
      </div>
    </div>

    <!-- Linha decorativa -->
    <div class="w-16 h-1 bg-brand-amarelo mb-5" />

    <!-- Legenda -->
    <div class="flex gap-5 mb-5 flex-wrap">
      <template v-for="item in legenda" :key="item.tipo">
        <div class="flex items-center gap-2 text-[8pt] text-fg-muted">
          <span
            class="inline-block w-3 h-3 shrink-0"
            :class="tipoCls[item.tipo].replace(/border-l-4\s+border-\S+/, '').trim()"
            :style="{
              borderLeft: `4px solid var(--color-${
                item.tipo === 'obrig'    ? 'brand-azul' :
                item.tipo === 'optativa'? 'brand-azul-claro' :
                item.tipo === 'extensao'? 'brand-verde' :
                                          'brand-azul-escuro'
              })`
            }"
          />
          {{ item.label }}
        </div>
      </template>
    </div>

    <!-- Grade: 13 colunas (uma por quadrimestre) -->
    <div
      class="grid gap-x-2 gap-y-0"
      :style="{ gridTemplateColumns: `repeat(${QUADS}, 1fr)` }"
    >
      <!-- Rótulos de quadrimestre -->
      <template v-for="q in quads" :key="`h-${q}`">
        <div
          class="pb-[6px]"
          :class="q <= 3 ? 'border-b-2 border-brand-verde' : 'border-b-2 border-brand-azul'"
        >
          <span
            class="font-mono text-[7pt] font-bold tracking-[1px] uppercase block text-center"
            :class="q <= 3 ? 'text-brand-verde' : 'text-brand-azul'"
          >
            Q{{ q }}
          </span>
          <span
            class="font-mono text-[6.5pt] block text-center"
            :class="q <= 3 ? 'text-brand-verde' : 'text-fg-muted'"
          >
            {{ q <= 3 ? 'BC&T' : '' }}
          </span>
        </div>
      </template>

      <!-- Células de disciplinas por coluna (quadrimestre) -->
      <template v-for="q in quads" :key="`col-${q}`">
        <div class="flex flex-col gap-[4px] pt-[6px]">
          <template v-for="disc in porQuad.get(q)" :key="disc.codigo">
            <div
              class="px-[5px] py-[4px] text-[7.5pt] [break-inside:avoid]"
              :class="tipoCls[disc.tipo]"
            >
              <span class="font-mono text-[6.5pt] text-fg-muted block leading-[1.3]">
                {{ disc.codigo }}
              </span>
              <span class="text-fg-default leading-[1.35] block">
                {{ disc.nome }}
              </span>
              <span class="font-mono text-[6pt] text-fg-muted block mt-[2px]">
                {{ disc.cred }} cr.
              </span>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Nota de rodapé e folio -->
    <p class="mt-5 mb-4 text-[7.5pt] text-fg-muted border-t border-border-subtle pt-2">
      Disciplinas do BC&T (Q1–Q3) representam créditos que são integralmente aproveitados no BCC.
      Grade simplificada para fins ilustrativos; verificar SIGAA para a grade oficial vigente.
    </p>

    <PdfFolio secao="Parte 3 · BCC" num="15" :w="1011" />
  </article>
</template>
