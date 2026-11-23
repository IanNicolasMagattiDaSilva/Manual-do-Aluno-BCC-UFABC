<script setup lang="ts">
/**
 * Hero.vue — Bloco de título de página (hero de seção).
 * Convertido de Hero.dc.html.
 *
 * Props:
 *   parte  — eyebrow label (ex: "Parte 1 · UFABC")
 *   titulo — título principal em uppercase
 *   tema   — 'amarelo' | 'azul'
 *   seed   — semente do Wafer decorativo
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  parte?:  string
  titulo?: string
  tema?:   Tema
  seed?:   number
}>(), {
  parte:  'Parte 1 · UFABC',
  titulo: 'Campi e cursos',
  tema:   'amarelo',
  seed:   11,
})

const t = computed(() => themes[props.tema])
</script>

<template>
  <div
    class="w-full min-h-[220px] relative overflow-hidden flex flex-col justify-end px-9 pt-9 pb-8 box-border"
    :style="{ background: t.bg, color: t.title }"
  >
    <!-- Wafer decorativo no canto direito -->
    <div
      aria-hidden="true"
      class="absolute right-0 top-0 w-[460px] h-[280px]"
    >
      <Wafer
        :tema="tema"
        :w="460"
        :h="280"
        :die="76"
        :ax="1"
        :ay="0.3"
        :seed="seed"
        :fundo="false"
      />
    </div>

    <!-- Eyebrow -->
    <p
      class="relative m-0 mb-2 font-mono text-[13px] font-bold tracking-[4px] uppercase"
      :style="{ color: t.text }"
    >
      {{ parte }}
    </p>

    <!-- Título -->
    <h1
      class="relative m-0 font-display font-normal [font-size:clamp(48px,8vw,64px)] leading-none uppercase max-w-[520px]"
      :style="{ color: t.title }"
    >
      {{ titulo }}
    </h1>
  </div>
</template>
