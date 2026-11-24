<script setup lang="ts">
/**
 * PdfTexto.vue — Página de texto corrido com tabela para o PDF.
 * Formato A4 portrait. Tipografia densa, corpo informativo.
 *
 * Exemplo de uso: capítulo de Avaliação e Coeficientes.
 *
 * Props:
 *   tema — variante de cor: 'amarelo' | 'azul'
 */

import { PdfFolio } from '@features/pdf-export'
import type { Tema } from '@shared/config/tokens'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

interface ConceituacaoRow {
  conceito: string
  cr:       string
  situacao: string
  obs:      string
}

const conceituacao: ConceituacaoRow[] = [
  { conceito: 'A',  cr: '4,0', situacao: 'Aprovado',  obs: 'Excelente' },
  { conceito: 'B',  cr: '3,0', situacao: 'Aprovado',  obs: 'Bom' },
  { conceito: 'C',  cr: '2,0', situacao: 'Aprovado',  obs: 'Regular' },
  { conceito: 'D',  cr: '1,0', situacao: 'Reprovado', obs: 'Insuficiente' },
  { conceito: 'F',  cr: '0,0', situacao: 'Reprovado', obs: 'Frequência insuficiente' },
  { conceito: 'O',  cr: '0,0', situacao: 'Reprovado', obs: 'Sem avaliação / abandono' },
  { conceito: 'I',  cr: '—',   situacao: 'Incompleto',obs: 'Prazo para complementação' },
  { conceito: 'Ex', cr: '—',   situacao: 'Isento',    obs: 'Aproveitamento ou dispensa' },
]

interface CalloutItem {
  formula: string
  desc:    string
}

const callouts: CalloutItem[] = [
  { formula: 'CR = Σ (peso × CR_disciplina) / Σ pesos', desc: 'Coeficiente de Rendimento acumulado (ponderado por créditos).' },
  { formula: 'CA = CR das disciplinas obrigatórias',     desc: 'Coeficiente de Aproveitamento — usado para alguns editais internos.' },
]
</script>

<template>
  <article
    class="max-w-[794px] mx-auto bg-bg-default text-fg-default font-sans text-[11pt] leading-[1.65] box-border px-[72px] pt-[64px] pb-[48px]"
  >
    <!-- Eyebrow / parte -->
    <p class="m-0 mb-2 font-mono text-[8pt] font-bold tracking-[3px] uppercase text-brand-azul">
      Parte 1 · UFABC
    </p>

    <!-- Título da seção — data-pdf-section para string-set no print.css -->
    <h1
      data-pdf-section
      class="m-0 mb-6 font-display font-normal text-[36pt] leading-[1.05] uppercase text-fg-default"
    >
      Avaliação e<br>Coeficientes
    </h1>

    <!-- Linha decorativa sob o título -->
    <div class="w-16 h-1 bg-brand-amarelo mb-8" />

    <!-- Corpo: introdução -->
    <p class="m-0 mb-4 text-fg-strong">
      A UFABC utiliza um sistema de conceitos (letras) no lugar de notas numéricas. Cada conceito
      corresponde a um valor de Coeficiente de Rendimento (CR) que é usado no cálculo do
      Coeficiente de Rendimento Acumulado ao longo de toda a graduação.
    </p>

    <p class="m-0 mb-4 text-fg-strong">
      O sistema foi concebido para reduzir a pressão sobre décimos e centésimos, ao mesmo tempo
      que mantém um critério objetivo de progressão. O estudante que obtém conceito&nbsp;<strong>C</strong>
      em todas as disciplinas termina o curso com CR&nbsp;2,0, que é o mínimo para colação de grau.
    </p>

    <!-- Subtítulo H2 -->
    <h2 class="mt-8 mb-3 font-display font-normal text-[18pt] uppercase leading-[1.1] text-fg-default">
      Tabela de conceitos
    </h2>

    <!-- Tabela de conceituação -->
    <table class="w-full border-collapse text-[10pt] mb-8 [break-inside:avoid]">
      <thead>
        <tr class="bg-fg-default text-bg-default">
          <th class="text-left px-3 py-2 font-mono text-[8pt] tracking-[2px] uppercase font-semibold w-[56px]">
            Conceito
          </th>
          <th class="text-right px-3 py-2 font-mono text-[8pt] tracking-[2px] uppercase font-semibold w-[48px]">
            CR
          </th>
          <th class="text-left px-3 py-2 font-mono text-[8pt] tracking-[2px] uppercase font-semibold w-[112px]">
            Situação
          </th>
          <th class="text-left px-3 py-2 font-mono text-[8pt] tracking-[2px] uppercase font-semibold">
            Observação
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, i) in conceituacao" :key="row.conceito">
          <tr :class="i % 2 === 0 ? 'bg-bg-default' : 'bg-bg-surface'">
            <td class="px-3 py-[7px] font-mono font-bold text-[11pt]">
              <span
                :class="[
                  'inline-flex items-center justify-center w-7 h-7 text-[10pt] font-mono font-bold',
                  row.situacao === 'Aprovado'
                    ? 'bg-brand-verde text-bg-default'
                    : row.situacao === 'Reprovado'
                      ? 'bg-status-erro text-bg-default'
                      : row.conceito === 'D'
                        ? 'bg-brand-amarelo text-fg-default'
                        : 'bg-border-strong text-fg-default',
                ]"
              >
                {{ row.conceito }}
              </span>
            </td>
            <td class="px-3 py-[7px] text-right font-mono text-fg-default">
              {{ row.cr }}
            </td>
            <td class="px-3 py-[7px] text-fg-strong">
              {{ row.situacao }}
            </td>
            <td class="px-3 py-[7px] text-fg-muted text-[10pt]">
              {{ row.obs }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Subtítulo H2 -->
    <h2 class="mt-6 mb-3 font-display font-normal text-[18pt] uppercase leading-[1.1] text-fg-default">
      Fórmulas de coeficiente
    </h2>

    <p class="m-0 mb-5 text-fg-strong">
      A UFABC publica dois índices oficiais no histórico escolar. Ambos são calculados com base
      nos conceitos de disciplinas cursadas (excluindo aproveitamentos e isenções).
    </p>

    <!-- Callout cards com fórmulas -->
    <div class="flex flex-col gap-4 mb-8">
      <div
        v-for="item in callouts"
        :key="item.formula"
        class="border-l-4 border-brand-azul bg-bg-azul-soft px-5 py-4 [break-inside:avoid]"
      >
        <code class="font-mono text-[9.5pt] text-brand-azul-escuro block mb-1">
          {{ item.formula }}
        </code>
        <p class="m-0 text-[10pt] text-fg-strong">
          {{ item.desc }}
        </p>
      </div>
    </div>

    <!-- Subtítulo H2 -->
    <h2 class="mt-6 mb-3 font-display font-normal text-[18pt] uppercase leading-[1.1] text-fg-default">
      Frequência mínima
    </h2>

    <p class="m-0 mb-4 text-fg-strong">
      A UFABC exige frequência mínima de <strong>75&nbsp;%</strong> em cada disciplina. O não
      cumprimento implica conceito&nbsp;<strong class="font-mono">F</strong> automaticamente,
      independentemente do desempenho nas avaliações. O controle de presença é responsabilidade
      do docente e pode ser verificado pelo SIGAA.
    </p>

    <p class="m-0 mb-4 text-fg-strong">
      Disciplinas em regime EAD (online) seguem os mesmos critérios de frequência, sendo que a
      participação nas atividades assíncronas é contabilizada como presença conforme o plano de
      ensino definido pelo docente responsável.
    </p>

    <!-- Nota de rodapé da seção -->
    <p class="mt-6 mb-8 text-[9pt] text-fg-muted border-t border-border-subtle pt-3">
      Fonte: Resolução ConsEPE n.&nbsp;182/2016 e Regulamento de Graduação vigente.
      Consulte sempre a versão atualizada em&nbsp;<span class="font-mono">prograd.ufabc.edu.br</span>.
    </p>

    <!-- Rodapé da folha -->
    <PdfFolio secao="Parte 1 · UFABC" num="05" :w="650" />
  </article>
</template>
