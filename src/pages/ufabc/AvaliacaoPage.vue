<script setup lang="ts">
/**
 * AvaliacaoPage.vue — Avaliação e coeficientes.
 * Rota: /ufabc/avaliacao
 *
 * Explica os conceitos (A–F, O, I), os coeficientes CR/CA/CP
 * e boas práticas para manter o rendimento acadêmico.
 *
 * Convertido de: examples/mockups/Pagina.dc.html
 *
 * Props:
 *   tema — variante de cor do hero: 'amarelo' | 'azul'
 */

import DocLayout from '../_layouts/DocLayout.vue'
import type { Tema } from '@shared/config/tokens'
import type { Grade, Coefficient } from '@entities/course/types'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

// ---------------------------------------------------------------------------
// Mapa de hex → classe Tailwind para badges de conceito.
// Os hexes vêm do tipo Grade (campo bg/fg); aqui convertemos para classes
// utilitárias para NÃO deixar style="" inline no DOM.
// ---------------------------------------------------------------------------
const BG_CLASS: Record<string, string> = {
  '#006633': 'bg-brand-verde',
  '#FFCC00': 'bg-brand-amarelo',
  '#B3261E': 'bg-status-erro',
  '#4A5568': 'bg-fg-muted',
  '#E6F4F9': 'bg-bg-azul-soft',
}

const FG_CLASS: Record<string, string> = {
  '#FFFFFF': 'text-white',
  '#0E1726': 'text-fg-default',
  '#B3261E': 'text-status-erro',
  '#4A5568': 'text-fg-muted',
}

// ---------------------------------------------------------------------------
// Coef. hex → classe border-top para cards de coeficiente
// ---------------------------------------------------------------------------
const COEF_BORDER_CLASS: Record<string, string> = {
  '#008BBB': 'border-t-brand-azul',
  '#006633': 'border-t-brand-verde',
  '#FFCC00': 'border-t-brand-amarelo',
}

// ---------------------------------------------------------------------------
// Dados inline — conceitos da UFABC
// ---------------------------------------------------------------------------
const GRADES: Grade[] = [
  {
    k:      'A',
    status: 'Aprovado',
    d:      'Desempenho excelente. Equivale a 4,0 pontos no cálculo do CR.',
    bg:     '#006633',
    fg:     '#FFFFFF',
  },
  {
    k:      'B',
    status: 'Aprovado',
    d:      'Desempenho bom. Equivale a 3,0 pontos no cálculo do CR.',
    bg:     '#006633',
    fg:     '#FFFFFF',
  },
  {
    k:      'C',
    status: 'Aprovado',
    d:      'Desempenho regular. Equivale a 2,0 pontos no cálculo do CR.',
    bg:     '#006633',
    fg:     '#FFFFFF',
  },
  {
    k:      'D',
    status: 'Aprovado',
    d:      'Desempenho suficiente (mínimo para aprovação). Equivale a 1,0 ponto no CR.',
    bg:     '#FFCC00',
    fg:     '#0E1726',
  },
  {
    k:      'F',
    status: 'Reprovado',
    d:      'Reprovado por desempenho insuficiente. Equivale a 0,0 pontos no CR.',
    bg:     '#B3261E',
    fg:     '#FFFFFF',
  },
  {
    k:      'O',
    status: 'Reprovado',
    d:      'Reprovado por abandono ou trancamento tardio. Não entra no cálculo do CR.',
    bg:     '#B3261E',
    fg:     '#FFFFFF',
  },
  {
    k:      'I',
    status: 'Incompleto',
    d:      'Situação temporária acordada com o professor. Deve ser regularizado no prazo.',
    bg:     '#E6F4F9',
    fg:     '#0E1726',
  },
]

// ---------------------------------------------------------------------------
// Dados inline — coeficientes acadêmicos
// ---------------------------------------------------------------------------
const COEFFICIENTS: Coefficient[] = [
  {
    k:    'CR',
    name: 'Coeficiente de Rendimento',
    d:
      'Média ponderada dos conceitos obtidos em todas as disciplinas cursadas, ' +
      'usando os créditos como peso. Conceito O não entra no cálculo. ' +
      'Varia de 0,0 a 4,0.',
    c: '#008BBB',
  },
  {
    k:    'CA',
    name: 'Coeficiente de Aprovação',
    d:
      'Proporção de créditos aprovados (conceitos A, B, C ou D) sobre o total ' +
      'de créditos tentados. Mede a taxa de sucesso nas tentativas de disciplina.',
    c: '#006633',
  },
  {
    k:    'CP',
    name: 'Coeficiente de Progressão',
    d:
      'Mede o avanço do aluno em relação ao total de créditos exigidos para ' +
      'conclusão do curso. Usado para fins de verificação de progressão mínima ' +
      'e renovação de bolsas.',
    c: '#FFCC00',
  },
]

// ---------------------------------------------------------------------------
// Helpers computados para uso no template
// ---------------------------------------------------------------------------
function badgeBg(hex: string): string {
  return BG_CLASS[hex] ?? 'bg-fg-muted'
}

function badgeFg(hex: string): string {
  return FG_CLASS[hex] ?? 'text-white'
}

function coefBorder(hex: string): string {
  return COEF_BORDER_CLASS[hex] ?? 'border-t-border-strong'
}

// Status class para coluna de status na tabela
function statusClass(status: Grade['status']): string {
  if (status === 'Aprovado')   return 'text-brand-verde'
  if (status === 'Reprovado')  return 'text-status-erro'
  return 'text-fg-muted'
}
</script>

<template>
  <DocLayout
    title="Avaliação e coeficientes"
    parte="Parte 1 · UFABC"
    section="ufabc"
    :tema="tema"
  >
    <!-- Breadcrumb -->
    <p class="m-0 mb-6 font-mono text-[13px] text-fg-muted">
      <RouterLink to="/" class="text-fg-muted no-underline hover:text-fg-default">Início</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink to="/ufabc/campi" class="text-fg-muted no-underline hover:text-fg-default">UFABC</RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-fg-default">Avaliação e coeficientes</span>
    </p>

    <!-- Lead -->
    <p class="mt-0 mb-8 text-[19px] text-fg-strong leading-[1.7]">
      O desempenho do aluno em cada disciplina é expresso por
      <strong>conceitos</strong>, e não por notas numéricas. Compreender
      os conceitos e os coeficientes é essencial para planejar a trajetória
      acadêmica com segurança.
    </p>

    <!-- ------------------------------------------------------------------ -->
    <!-- Conceitos                                                           -->
    <!-- ------------------------------------------------------------------ -->
    <h2
      id="conceitos"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Conceitos
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      A UFABC utiliza um sistema de conceitos de A a F, além dos conceitos
      especiais O (abandono) e I (incompleto). Cada conceito tem peso
      específico para o cálculo do Coeficiente de Rendimento (CR).
    </p>

    <div class="overflow-x-auto mb-8">
      <table class="w-full border-collapse text-[15px] font-sans" aria-label="Tabela de conceitos da UFABC">
        <thead>
          <tr class="border-b-2 border-fg-default">
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal w-[72px]">
              Conceito
            </th>
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal w-[120px]">
              Situação
            </th>
            <th class="text-left py-3 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Descrição
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="g in GRADES" :key="g.k">
            <tr class="border-b border-border-subtle">
              <!-- Badge do conceito — cor via classes utilitárias, sem style inline -->
              <td class="py-[10px] pr-4">
                <span
                  class="inline-flex items-center justify-center w-9 h-9 font-mono text-[16px] font-bold rounded"
                  :class="[badgeBg(g.bg), badgeFg(g.fg)]"
                  :aria-label="`Conceito ${g.k}`"
                >
                  {{ g.k }}
                </span>
              </td>
              <td
                class="py-[10px] pr-4 font-mono text-[13px] font-semibold"
                :class="statusClass(g.status)"
              >
                {{ g.status }}
              </td>
              <td class="py-[10px] text-fg-strong">
                {{ g.d }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Callout O vs F -->
    <div
      class="bg-bg-azul-soft border-l-4 border-brand-azul-escuro px-5 py-4 mb-10 text-[15px] text-fg-strong"
      role="note"
    >
      <strong class="text-fg-default">Atenção — O vs F:</strong> O conceito
      <strong>O</strong> é registrado por abandono (ausência sem trancamento formal)
      e <em>não</em> entra no cálculo do CR, mas compromete o Coeficiente de Aprovação.
      Sempre formalize o trancamento dentro do prazo para evitar o conceito F.
    </div>

    <!-- ------------------------------------------------------------------ -->
    <!-- Coeficientes                                                        -->
    <!-- ------------------------------------------------------------------ -->
    <h2
      id="coeficientes"
      class="mt-12 mb-6 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Coeficientes
    </h2>
    <p class="mt-0 mb-8 text-fg-strong leading-[1.7]">
      Três coeficientes medem o desempenho acadêmico. Eles são recalculados ao final
      de cada quadrimestre e publicados no histórico escolar.
    </p>

    <section aria-label="Coeficientes acadêmicos">
      <ul class="list-none m-0 p-0 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        <template v-for="coef in COEFFICIENTS" :key="coef.k">
          <li
            class="bg-bg-surface border border-border-subtle rounded-lg border-t-[3px] flex flex-col gap-3 p-6"
            :class="coefBorder(coef.c)"
          >
            <p class="m-0 font-mono text-[28px] font-bold tracking-tight text-fg-default">
              {{ coef.k }}
            </p>
            <h3 class="m-0 font-display font-normal text-[18px] leading-tight uppercase text-fg-default">
              {{ coef.name }}
            </h3>
            <p class="m-0 text-[14px] text-fg-strong leading-[1.65] flex-1">
              {{ coef.d }}
            </p>
          </li>
        </template>
      </ul>
    </section>

    <!-- ------------------------------------------------------------------ -->
    <!-- Boas práticas                                                       -->
    <!-- ------------------------------------------------------------------ -->
    <h2
      id="boas-praticas"
      class="mt-14 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Boas práticas
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      Manter o CR acima de 2,0 é requisito para candidatura a bolsas de pesquisa e
      monitoria. Algumas dicas para gerenciar bem o rendimento:
    </p>

    <ul class="m-0 mb-10 pl-6 flex flex-col gap-3 text-[15px] text-fg-strong leading-[1.7]">
      <li>
        Priorize disciplinas obrigatórias do núcleo comum nos primeiros quadrimestres —
        elas são pré-requisito para muitas optativas.
      </li>
      <li>
        Monitore seu CR após cada quadrimestre. Uma queda brusca exige atenção
        imediata ao número de disciplinas e à carga de créditos.
      </li>
      <li>
        Se perceber dificuldade em alguma disciplina, tranche-a dentro do prazo
        oficial em vez de aguardar o conceito F.
      </li>
      <li>
        Converse com seu orientador acadêmico antes de tomar decisões sobre
        trancamento total — pode haver impacto em bolsas e prazos de integralização.
      </li>
    </ul>

    <aside
      aria-label="Dica"
      class="mt-2 p-5 bg-bg-azul-soft border-l-4 border-brand-azul rounded-r-lg"
    >
      <p class="m-0 font-mono text-[11px] font-bold tracking-[3px] uppercase text-brand-azul-escuro mb-2">
        Dica
      </p>
      <p class="m-0 text-[15px] text-fg-strong leading-[1.65]">
        O sistema acadêmico permite simular o CR incluindo notas hipotéticas ainda
        não lançadas. Use-o para projetar o impacto de diferentes conceitos na
        sua média antes do fim do quadrimestre.
      </p>
    </aside>
  </DocLayout>
</template>
