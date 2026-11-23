<script setup lang="ts">
/**
 * PdfCapa.vue — Capa do PDF (primeira página).
 * Convertido de Capa.dc.html (mockup placeholder → spec da issue).
 *
 * Layout:
 *   - Área superior: wafer full-width como fundo, com título "MANUAL DO ALUNO"
 *     sobre fundo colorido (amarelo ou azul).
 *   - Bloco central: nome do aluno + sumário de partes (Parte 1, 2, 3).
 *   - Faixa inferior escura: logotipo BCC em branco + nome da universidade.
 *
 * NOTA: layout absoluto apenas para visualização web; na impressão quem controla é @page.
 * As dimensões 794×1123 (A4 a 96 dpi) são comentário de referência apenas.
 * O @page { size: A4; margin: 0 } da capa (:first) garante sangria total.
 *
 * Props:
 *   tema  — 'amarelo' | 'azul' (default: 'amarelo')
 *   nome  — nome do aluno exibido na capa
 *   seed  — semente do wafer decorativo
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { Logo }  from '@shared/ui/Logo'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  tema?: Tema
  nome?: string
  seed?: number
}>(), {
  tema: 'amarelo',
  nome: 'SEU NOME',
  seed: 3,
})

const t = computed(() => themes[props.tema])

/** Partes do manual para o sumário da capa */
const partes = [
  { num: '01', label: 'UFABC',          titulo: 'A universidade e seus campi'    },
  { num: '02', label: 'BCT',            titulo: 'Bacharelado em Ciência e Tecnologia' },
  { num: '03', label: 'BCC',            titulo: 'Bacharelado em Ciência da Computação' },
]
</script>

<template>
  <!--
    Wrapper da página: ocupa toda a folha A4.
    Na web usamos min-h-screen; na impressão @page :first controla o tamanho.
  -->
  <article class="relative w-full min-h-screen flex flex-col bg-bg-default font-sans text-fg-default overflow-hidden">

    <!-- ═══════════════════════════════════════════════════════
         BLOCO SUPERIOR — Hero com wafer full-width
         Ocupa ~55% da altura da página (aprox. 620px de 1123px A4).
    ════════════════════════════════════════════════════════════ -->
    <div
      class="relative flex-[0_0_55%] flex flex-col justify-end overflow-hidden"
      :style="{ background: t.bg }"
    >
      <!-- Wafer: posicionado absolute para cobrir todo o hero -->
      <div
        aria-hidden="true"
        class="absolute inset-0 w-full h-full"
      >
        <Wafer
          :tema="tema"
          :w="794"
          :h="620"
          :die="96"
          :ax="1"
          :ay="0"
          :seed="seed"
          :fundo="false"
        />
      </div>

      <!-- Texto do hero (relativo ao wafer) -->
      <div class="relative z-10 px-14 pb-10 pt-10">
        <!-- Eyebrow mono -->
        <p
          class="font-mono text-[13px] font-bold tracking-[4px] uppercase mb-3"
          :style="{ color: t.text }"
        >
          Universidade Federal do ABC
        </p>

        <!-- Título principal -->
        <h1
          class="font-display text-[80px] leading-none uppercase"
          :style="{ color: t.title }"
        >
          Manual<br>do Aluno
        </h1>

        <!-- Sub-eyebrow -->
        <p
          class="mt-3 font-mono text-[14px] font-bold tracking-[2px] uppercase"
          :style="{ color: t.text }"
        >
          Bacharelado em Ciência da Computação
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         BLOCO CENTRAL — Nome do aluno + sumário de partes
         Fundo branco/surface, ocupa ~33% da folha.
    ════════════════════════════════════════════════════════════ -->
    <div class="flex-1 px-14 py-8 flex flex-col justify-between bg-bg-default">

      <!-- Nome do aluno -->
      <div class="mb-6">
        <p class="font-mono text-[11px] font-bold tracking-[4px] uppercase text-fg-muted mb-1">
          Estudante
        </p>
        <p class="font-display text-[36px] uppercase leading-none text-fg-default">
          {{ nome }}
        </p>
      </div>

      <!-- Sumário de partes -->
      <ul class="list-none m-0 p-0 flex flex-col gap-3">
        <template v-for="parte in partes" :key="parte.num">
          <li class="flex items-baseline gap-4 border-t border-border-subtle pt-3">
            <!-- Número da parte -->
            <span class="font-mono text-[11px] font-bold tracking-[3px] uppercase text-fg-muted w-6 shrink-0">
              {{ parte.num }}
            </span>
            <!-- Label colorido -->
            <span
              class="font-mono text-[11px] font-bold tracking-[2px] uppercase shrink-0"
              :style="{ color: t.bg }"
            >
              {{ parte.label }}
            </span>
            <!-- Título da parte -->
            <span class="font-sans text-[14px] text-fg-strong">
              {{ parte.titulo }}
            </span>
          </li>
        </template>
      </ul>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         FAIXA INFERIOR ESCURA — Logo BCC + universidade
         Fundo #0E1726 (fg-default), texto claro.
    ════════════════════════════════════════════════════════════ -->
    <div class="bg-fg-default flex items-center justify-between px-14 py-6">
      <!-- Logo BCC em branco -->
      <Logo :cell="14" color="#FFFFFF" />

      <!-- Nome da universidade à direita -->
      <div class="text-right">
        <p class="font-mono text-[10px] tracking-[3px] uppercase text-fg-on-dark-muted leading-tight">
          Universidade Federal do ABC
        </p>
        <p class="font-mono text-[10px] tracking-[3px] uppercase text-fg-on-dark-muted leading-tight mt-1">
          Ciência da Computação
        </p>
      </div>
    </div>

  </article>
</template>
