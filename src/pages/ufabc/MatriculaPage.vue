<script setup lang="ts">
/**
 * MatriculaPage.vue — Matrícula e ajustes.
 * Rota: /ufabc/matricula
 *
 * Explica o processo de matrícula inicial, ajuste de matrícula,
 * trancamento de disciplinas e prazos relevantes na UFABC.
 */

import DocLayout from '../_layouts/DocLayout.vue'
import type { Tema } from '@shared/config/tokens'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

interface Etapa {
  num:      string
  titulo:   string
  descricao: string
  acento:   string
}

const ETAPAS: Etapa[] = [
  {
    num:      '01',
    titulo:   'Matrícula inicial',
    descricao:
      'Realizada no portal do aluno antes do início do quadrimestre. ' +
      'O sistema exibe as turmas disponíveis e o aluno seleciona as disciplinas ' +
      'dentro do limite de créditos permitido para o período.',
    acento: 'border-t-brand-azul',
  },
  {
    num:      '02',
    titulo:   'Período de ajuste',
    descricao:
      'Ocorre nas primeiras semanas do quadrimestre. Permite adicionar ou ' +
      'remover disciplinas já matriculadas, sujeito à disponibilidade de vagas ' +
      'e ao limite de créditos. Prazos publicados no calendário acadêmico.',
    acento: 'border-t-brand-verde',
  },
  {
    num:      '03',
    titulo:   'Trancamento parcial',
    descricao:
      'Cancelamento de disciplinas específicas após o período de ajuste. ' +
      'A disciplina é registrada com conceito O (trancado), que não impacta o CR ' +
      'mas conta como tentativa para fins de verificação de aproveitamento.',
    acento: 'border-t-brand-amarelo',
  },
  {
    num:      '04',
    titulo:   'Trancamento total',
    descricao:
      'Cancelamento de todas as disciplinas do quadrimestre. Preserva o vínculo ' +
      'do aluno com a instituição. Limite de trancamentos totais regulamentado ' +
      'pelo Regimento Geral de Graduação.',
    acento: 'border-t-brand-azul-claro',
  },
]

interface Limite {
  situacao: string
  min:      number
  max:      number
}

const LIMITES: Limite[] = [
  { situacao: 'Ingressante (1º quadrimestre)', min: 16, max: 24 },
  { situacao: 'Aluno regular',                min: 8,  max: 32 },
  { situacao: 'Aluno em reintegração',        min: 8,  max: 24 },
  { situacao: 'Aluno de transferência',       min: 8,  max: 32 },
]
</script>

<template>
  <DocLayout
    title="Matrícula e ajustes"
    parte="Parte 1 · UFABC"
    section="ufabc"
    :tema="tema"
  >
    <!-- TOC lateral -->
    <template #toc>
      <ul class="list-none m-0 p-0 flex flex-col gap-1">
        <li>
          <a
            href="#processo"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            Processo de matrícula
          </a>
        </li>
        <li>
          <a
            href="#limites-creditos"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            Limites de créditos
          </a>
        </li>
        <li>
          <a
            href="#trancamento"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            Trancamento
          </a>
        </li>
        <li>
          <a
            href="#prazos"
            class="block py-1 text-fg-muted text-[13px] no-underline hover:text-fg-default border-l-2 border-transparent pl-3 hover:border-brand-azul transition-colors"
          >
            Prazos e calendário
          </a>
        </li>
      </ul>
    </template>

    <!-- Breadcrumb -->
    <p class="m-0 mb-6 font-mono text-[13px] text-fg-muted">
      <RouterLink to="/" class="text-fg-muted no-underline hover:text-fg-default">Início</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink to="/ufabc/campi" class="text-fg-muted no-underline hover:text-fg-default">UFABC</RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-fg-default">Matrícula e ajustes</span>
    </p>

    <!-- Lead -->
    <p class="mt-0 mb-10 text-[19px] text-fg-strong leading-[1.7]">
      A matrícula na UFABC é feita pelo <strong>portal do aluno</strong> em datas
      definidas no calendário acadêmico. Conhecer as etapas e os prazos evita
      surpresas e garante uma grade horária equilibrada.
    </p>

    <!-- Processo -->
    <h2
      id="processo"
      class="mt-0 mb-6 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Processo de matrícula
    </h2>

    <section aria-label="Etapas do processo de matrícula">
      <ul class="list-none m-0 p-0 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        <template v-for="etapa in ETAPAS" :key="etapa.num">
          <li
            class="bg-bg-surface border border-border-subtle rounded-lg border-t-[3px] flex flex-col gap-3 p-6"
            :class="etapa.acento"
          >
            <p class="m-0 font-mono text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
              Etapa {{ etapa.num }}
            </p>
            <h3 class="m-0 font-display font-normal text-[22px] leading-tight uppercase text-fg-default">
              {{ etapa.titulo }}
            </h3>
            <p class="m-0 text-[15px] text-fg-strong leading-[1.65] flex-1">
              {{ etapa.descricao }}
            </p>
          </li>
        </template>
      </ul>
    </section>

    <!-- Limites de créditos -->
    <h2
      id="limites-creditos"
      class="mt-14 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Limites de créditos
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      O número de créditos que um aluno pode cursar em um mesmo quadrimestre varia
      conforme sua situação acadêmica. Cada disciplina equivale a 4 créditos (teóricas)
      ou 2 créditos (práticas), salvo exceções indicadas no catálogo.
    </p>

    <div class="overflow-x-auto mb-10">
      <table class="w-full border-collapse text-[15px] font-sans">
        <thead>
          <tr class="border-b-2 border-fg-default">
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Situação
            </th>
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Mín. créditos
            </th>
            <th class="text-left py-3 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Máx. créditos
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="lim in LIMITES" :key="lim.situacao">
            <tr class="border-b border-border-subtle">
              <td class="py-[10px] pr-4 text-fg-default">{{ lim.situacao }}</td>
              <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">{{ lim.min }}</td>
              <td class="py-[10px] font-mono text-[13px] text-fg-muted">{{ lim.max }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Callout info créditos -->
    <div
      class="bg-bg-azul-soft border-l-4 border-brand-azul-escuro px-5 py-4 mb-10 text-[15px] text-fg-strong"
      role="note"
    >
      <strong class="text-fg-default">Atenção:</strong> Alunos em reintegração ou
      com histórico de reprovações reiteradas podem ter o limite máximo reduzido
      pela Pró-Reitoria de Graduação. Consulte seu histórico no portal.
    </div>

    <!-- Trancamento -->
    <h2
      id="trancamento"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Trancamento
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      O trancamento pode ser <em>parcial</em> (apenas algumas disciplinas) ou
      <em>total</em> (todo o quadrimestre). Em ambos os casos, é necessário respeitar
      os prazos publicados no calendário acadêmico.
    </p>
    <p class="mt-0 mb-8 text-fg-strong leading-[1.7]">
      O conceito <strong>O</strong> (trancado) é registrado no histórico escolar,
      mas não entra no cálculo do Coeficiente de Rendimento (CR). Para disciplinas
      com pré-requisito, o trancamento não elimina a necessidade de cursá-las
      futuramente.
    </p>

    <!-- Prazos -->
    <h2
      id="prazos"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Prazos e calendário
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      Todas as datas de matrícula, ajuste e trancamento são publicadas no
      <strong>Calendário Acadêmico</strong> disponível no portal da UFABC antes do
      início de cada quadrimestre. É responsabilidade do aluno acompanhar e cumprir
      os prazos — atrasos não são aceitos como justificativa.
    </p>

    <aside
      aria-label="Dica"
      class="mt-2 p-5 bg-bg-azul-soft border-l-4 border-brand-azul rounded-r-lg"
    >
      <p class="m-0 font-mono text-[11px] font-bold tracking-[3px] uppercase text-brand-azul-escuro mb-2">
        Dica
      </p>
      <p class="m-0 text-[15px] text-fg-strong leading-[1.65]">
        Salve as datas do calendário acadêmico em seu aplicativo de agenda logo no
        início do quadrimestre. Muitos alunos perdem o prazo de ajuste por
        desatenção — e uma disciplina indesejada pode afetar seu coeficiente.
      </p>
    </aside>
  </DocLayout>
</template>
