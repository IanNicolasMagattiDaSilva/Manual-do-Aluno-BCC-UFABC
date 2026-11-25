<script setup lang="ts">
/**
 * CampiPage.vue — Página de documentação "Campi e cursos".
 * Convertida de Campi.dc.html (placeholder) + Pagina.dc.html (estrutura de doc).
 *
 * Usa DocLayout como wrapper (Header + Sidebar + main + TOC already composed).
 *
 * Props:
 *   tema — variante de cor do hero: 'amarelo' | 'azul'
 */

import DocLayout from '../_layouts/DocLayout.vue'
import type { Tema } from '@shared/config/tokens'

withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})
</script>

<template>
  <DocLayout
    title="Campi e cursos"
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
      <span class="text-fg-default">Campi e cursos</span>
    </p>

    <!-- Lead -->
    <p class="mt-0 mb-8 text-[19px] text-fg-strong leading-[1.7]">
      A UFABC possui dois campi, ambos no Grande ABC paulista, e oferece formação em
      duas etapas: o <strong>Bacharelado Interdisciplinar</strong> (BC&amp;T ou BCNH) e os
      <strong>cursos específicos</strong> de graduação.
    </p>

    <!-- Campi -->
    <h2
      id="campi"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Campi
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      A universidade está distribuída em dois campi complementares, cada um com
      laboratórios, biblioteca, restaurante universitário e moradia estudantil.
    </p>

    <div class="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-8">
      <!-- Santo André -->
      <div class="border-2 border-fg-default p-6">
        <p class="m-0 mb-1 font-mono text-[12px] font-bold tracking-[3px] uppercase text-brand-verde">
          Campus 1
        </p>
        <h3 class="mt-1 mb-2 font-display font-normal text-[28px] uppercase text-fg-default">
          Santo André
        </h3>
        <p class="m-0 text-[14px] text-fg-muted">
          Avenida dos Estados, 5001 · Bairro Bangu<br>
          CEP 09210-580 · Santo André / SP
        </p>
      </div>

      <!-- São Bernardo do Campo -->
      <div class="border-2 border-fg-default p-6">
        <p class="m-0 mb-1 font-mono text-[12px] font-bold tracking-[3px] uppercase text-brand-azul-escuro">
          Campus 2
        </p>
        <h3 class="mt-1 mb-2 font-display font-normal text-[28px] uppercase text-fg-default">
          São Bernardo do Campo
        </h3>
        <p class="m-0 text-[14px] text-fg-muted">
          Alameda da Universidade, s/n · Bairro Anchieta<br>
          CEP 09606-045 · São Bernardo do Campo / SP
        </p>
      </div>
    </div>

    <!-- Callout info -->
    <div
      class="bg-bg-azul-soft border-l-4 border-brand-azul-escuro px-5 py-4 mb-10 text-[15px] text-fg-strong"
      role="note"
    >
      <strong class="text-fg-default">Dica:</strong> Os dois campi são interligados por
      transporte gratuito fornecido pela UFABC. Consulte os horários no portal da
      universidade.
    </div>

    <!-- Cursos oferecidos -->
    <h2
      id="cursos"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Cursos oferecidos
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      A UFABC adota o modelo de <em>entrada ampla</em>: todo ingressante começa por um
      Bacharelado Interdisciplinar e, ao concluí-lo (ou antes, se atingir os requisitos),
      pode migrar para um curso específico.
    </p>

    <!-- Bacharelado Interdisciplinar -->
    <h2
      id="bacharel-interdisciplinar"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Bacharelado Interdisciplinar
    </h2>

    <div class="overflow-x-auto mb-8">
      <table class="w-full border-collapse text-[15px] font-sans">
        <thead>
          <tr class="border-b-2 border-fg-default">
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Sigla
            </th>
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Nome
            </th>
            <th class="text-left py-3 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Campus principal
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border-subtle">
            <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">BC&amp;T</td>
            <td class="py-[10px] pr-4 text-fg-default">Bacharelado em Ciência e Tecnologia</td>
            <td class="py-[10px] text-fg-muted">Santo André e São Bernardo</td>
          </tr>
          <tr class="border-b border-border-subtle">
            <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">BCNH</td>
            <td class="py-[10px] pr-4 text-fg-default">Bacharelado em Ciências e Humanidades</td>
            <td class="py-[10px] text-fg-muted">Santo André e São Bernardo</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cursos específicos -->
    <h2
      id="cursos-especificos"
      class="mt-12 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Cursos específicos
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      Após concluir o Bacharelado Interdisciplinar, o aluno pode ingressar em um dos
      cursos de formação específica. Entre os oferecidos pela área de Computação:
    </p>

    <div class="overflow-x-auto mb-10">
      <table class="w-full border-collapse text-[15px] font-sans">
        <thead>
          <tr class="border-b-2 border-fg-default">
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Sigla
            </th>
            <th class="text-left py-3 pr-4 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Nome
            </th>
            <th class="text-left py-3 font-mono text-[12px] tracking-[2px] uppercase text-fg-muted font-normal">
              Carga horária
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border-subtle">
            <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">BCC</td>
            <td class="py-[10px] pr-4 text-fg-default">Bacharelado em Ciência da Computação</td>
            <td class="py-[10px] text-fg-muted">3.280 h (PPC 2023)</td>
          </tr>
          <tr class="border-b border-border-subtle">
            <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">Eng. da Inf.</td>
            <td class="py-[10px] pr-4 text-fg-default">Bacharelado em Engenharia da Informação</td>
            <td class="py-[10px] text-fg-muted">3.600 h</td>
          </tr>
          <tr class="border-b border-border-subtle">
            <td class="py-[10px] pr-4 font-mono text-[13px] text-fg-muted">Ciência da Inf.</td>
            <td class="py-[10px] pr-4 text-fg-default">Bacharelado em Ciência da Informação</td>
            <td class="py-[10px] text-fg-muted">3.000 h</td>
          </tr>
        </tbody>
      </table>
    </div>
  </DocLayout>
</template>
