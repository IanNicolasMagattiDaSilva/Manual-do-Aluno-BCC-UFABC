<script setup lang="ts">
/**
 * PdfParte.vue — Abertura de cada parte do PDF (Parte 1, 2, 3).
 * Convertido de PdfParte.dc.html (mockup placeholder → spec da issue).
 *
 * Reutiliza o padrão visual do Hero.vue mas adaptado para página inteira A4:
 *   - Wafer full-width cobre ~60% superior da página.
 *   - Bloco inferior branco com número + título da parte.
 *   - h1[data-pdf-section] ativa a named page "section" e o string-set
 *     no print.css para alimentar o cabeçalho corrente do Paged.js.
 *   - break-before: page via classe .page-break-before (definida em print.css).
 *
 * NOTA: layout absoluto apenas para visualização web; na impressão quem controla é @page.
 *
 * Props:
 *   tema   — 'amarelo' | 'azul' (default: 'amarelo')
 *   num    — número ordinal da parte como string, ex: '01', '02', '03'
 *   label  — nome curto da parte, ex: 'UFABC', 'BCT', 'BCC'
 *   titulo — título descritivo da parte
 *   seed   — semente do wafer decorativo
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  tema?:   Tema
  num?:    string
  label?:  string
  titulo?: string
  seed?:   number
}>(), {
  tema:   'amarelo',
  num:    '01',
  label:  'UFABC',
  titulo: 'A universidade e seus campi',
  seed:   7,
})

const t = computed(() => themes[props.tema])

/** Texto completo para o cabeçalho corrente (string-set no print.css) */
const secaoLabel = computed(() => `Parte ${props.num} · ${props.label}`)
</script>

<template>
  <!--
    Wrapper da página de parte.
    .page-break-before é definida em print.css: break-before: page.
    min-h-screen simula a folha inteira na web.
  -->
  <article class="page-break-before relative w-full min-h-screen flex flex-col overflow-hidden bg-bg-default">

    <!-- ═══════════════════════════════════════════════════════
         BLOCO SUPERIOR — Fundo colorido + wafer full-width
         ~60% da altura da página.
    ════════════════════════════════════════════════════════════ -->
    <div
      class="relative flex-[0_0_60%] flex flex-col justify-end overflow-hidden"
      :style="{ background: t.bg }"
    >
      <!-- Wafer de fundo (cobre todo o bloco) -->
      <div
        aria-hidden="true"
        class="absolute inset-0 w-full h-full"
      >
        <Wafer
          :tema="tema"
          :w="794"
          :h="674"
          :die="96"
          :ax="0.5"
          :ay="0.5"
          :seed="seed"
          :fundo="false"
        />
      </div>

      <!-- Número da parte em tipografia display, canto inferior esquerdo -->
      <div class="relative z-10 px-14 pb-10">
        <span
          class="font-mono text-[11px] font-bold tracking-[4px] uppercase block mb-3"
          :style="{ color: t.text }"
        >
          Parte
        </span>
        <span
          class="font-display text-[120px] leading-none block"
          :style="{ color: t.title }"
          aria-hidden="true"
        >
          {{ props.num }}
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         BLOCO INFERIOR — Label + título da parte
         Fundo branco, ~40% da página.
    ════════════════════════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col justify-center px-14 py-10 bg-bg-default">

      <!-- Label colorido (nome curto da parte) -->
      <p
        class="font-mono text-[13px] font-bold tracking-[4px] uppercase mb-4"
        :style="{ color: t.bg }"
      >
        {{ label }}
      </p>

      <!--
        h1 com data-pdf-section:
          - Ativa a named page "section" via print.css: h1[data-pdf-section] { page: section }
          - Registra string-set para o cabeçalho corrente do Paged.js
          - break-before: page já vem do wrapper (.page-break-before)
      -->
      <h1
        class="font-display text-[56px] leading-tight uppercase text-fg-default m-0"
        data-pdf-section
      >
        {{ titulo }}
      </h1>

      <!-- Atributo oculto para alimentar o string-set de section-label no rodapé -->
      <span
        class="sr-only"
        :data-section-label="secaoLabel"
        aria-hidden="true"
      />

      <!-- Linha decorativa -->
      <div
        class="mt-10 h-1 w-16"
        :style="{ background: t.bg }"
        aria-hidden="true"
      />
    </div>

  </article>
</template>
