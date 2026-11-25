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
import type { Tema } from '@shared/config/tokens'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

/** Número de quadrimestres exibidos */
const QUADS = 15

type Tipo = 'obrig' | 'optativa' | 'extensao' | 'tcc'

interface Disciplina {
  codigo:    string
  nome:      string
  cred:      number
  tipo:      Tipo
  quad:      number  // 1–15
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


/** Total de créditos BCC (Q4–Q13) */
const totalCredsBcc = computed(() =>
  disciplinas
    .filter(d => d.quad >= 4)
    .reduce((s, d) => s + d.cred, 0),
)

const ANOS = [1, 2, 3, 4, 5]
const quadsDoAno = (ano: number) => [0, 1, 2].map(k => (ano - 1) * 3 + k + 1)

const COR: Record<Tipo, string> = {
  obrig:    'var(--color-brand-azul)',
  optativa: '#A0AAB4',
  extensao: 'var(--color-brand-verde)',
  tcc:      'var(--color-brand-amarelo)',
}
const COR_BCT = 'var(--color-fg-default)'
/** Q1–Q3 são BC&T (obrigatórias do BC&T, em preto). */
const corDe = (d: Disciplina) => (d.quad <= 3 ? COR_BCT : COR[d.tipo])

const legenda = [
  { cor: COR_BCT,          label: 'Obrigatória BC&T' },
  { cor: COR.obrig,        label: 'Obrigatória BCC' },
  { cor: COR.extensao,     label: 'Extensão' },
  { cor: COR.optativa,     label: 'Optativa / livre' },
  { cor: COR.tcc,          label: 'TCC' },
]
</script>

<template>
  <!-- A4 retrato: 5 colunas (uma por ano), 3 quadrimestres por coluna. -->
  <article
    data-section-label="Parte 3 · BCC"
    data-folio="Grade curricular sugerida"
    class="pdf-grade page-break-before"
  >
    <header class="pdf-grade__head">
      <div>
        <h1 data-pdf-section class="pdf-grade__title">Grade curricular sugerida · PPC 2023</h1>
        <p class="pdf-grade__sub">
          {{ QUADS }} quadrimestres (5 anos) recomendados · total BCC (Q4–Q13): {{ totalCredsBcc }} créditos
        </p>
      </div>
      <ul class="pdf-grade__legend">
        <li v-for="l in legenda" :key="l.label">
          <i :style="{ background: l.cor }" />{{ l.label }}
        </li>
      </ul>
    </header>

    <div class="pdf-grade__years">
      <section v-for="ano in ANOS" :key="ano" class="pdf-grade__year">
        <h2>{{ ano }}º ano</h2>
        <div v-for="q in quadsDoAno(ano)" :key="q" class="pdf-grade__quad">
          <p class="pdf-grade__qlabel">{{ q }}º quad.</p>
          <p
            v-for="d in porQuad.get(q)"
            :key="d.codigo"
            class="pdf-grade__disc"
            :class="{ 'pdf-grade__disc--tcc': d.tipo === 'tcc' }"
            :style="{ borderTopColor: corDe(d) }"
          >
            {{ d.nome }}
          </p>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.pdf-grade { font-family: var(--font-sans); color: var(--color-fg-default); }
.pdf-grade__head { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
.pdf-grade__title { margin: 0; font: 400 40px/1.05 var(--font-display); text-transform: uppercase; }
.pdf-grade__sub { margin: 6px 0 0; font-size: 11px; color: #4A5568; }
.pdf-grade__legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0; padding: 0; list-style: none; font-size: 10px; }
.pdf-grade__legend li { display: inline-flex; align-items: center; gap: 6px; }
.pdf-grade__legend i { width: 9px; height: 9px; display: inline-block; }
.pdf-grade__years { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.pdf-grade__year h2 { margin: 0 0 8px; padding-bottom: 5px; border-bottom: 2px solid var(--color-fg-default); font: 400 19px/1 var(--font-display); text-transform: uppercase; }
.pdf-grade__quad { margin-bottom: 12px; padding: 8px 7px 6px; background: #F3F5F7; break-inside: avoid; min-height: 120px; }
.pdf-grade__qlabel { margin: 0 0 3px; font: 700 10px/1.2 var(--font-mono); }
.pdf-grade__disc { margin: 0; padding: 4px 0 4px 2px; border-top: 2px solid; font-size: 9px; line-height: 1.25; color: #2D3748; }
.pdf-grade__disc--tcc { background: var(--color-brand-amarelo); font-weight: 700; color: var(--color-fg-default); }
</style>
