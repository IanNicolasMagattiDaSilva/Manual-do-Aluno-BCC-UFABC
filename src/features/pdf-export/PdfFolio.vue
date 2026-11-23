<script setup lang="ts">
/**
 * PdfFolio.vue — Rodapé das páginas do PDF.
 * Convertido de PdfFolio.dc.html.
 *
 * Props:
 *   secao — nome da seção (ex: "Parte 1 · UFABC")
 *   num   — número da página formatado (ex: "05")
 *   w     — largura em px (default: 650, equivale à área útil A4)
 */

withDefaults(defineProps<{
  secao?: string
  num?:   string
  w?:     number
}>(), {
  secao: 'Parte 1 · UFABC',
  num:   '01',
  w:     650,
})
</script>

<template>
  <div
    class="border-t border-border-strong flex items-end justify-between font-mono text-[12px] text-fg-muted box-border"
    style="height: 36px"
    :style="{ width: `${w}px` }"
  >
    <!-- Esquerda: manual + seção -->
    <span class="tracking-[2px] uppercase">
      Manual do aluno · {{ secao }}
    </span>

    <!-- Direita: indicador amarelo + número -->
    <span class="flex items-center gap-2">
      <span class="w-2 h-2 bg-brand-amarelo inline-block" />
      <span class="font-bold text-fg-default">{{ num }}</span>
    </span>
  </div>
</template>
