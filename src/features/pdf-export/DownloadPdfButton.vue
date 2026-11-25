<script setup lang="ts">
/**
 * DownloadPdfButton.vue — Botão "Baixar PDF".
 *
 * Link direto para /guia.pdf (gerado por `pnpm pdf` no pipeline e servido
 * junto com o resto da build). O atributo `download` força download em vez
 * de abrir inline. Em dev (`pnpm dev`) o arquivo não existe — teste em
 * `pnpm preview` depois de `pnpm pdf`, ou no site deployado.
 */

withDefaults(defineProps<{ href?: string; fileName?: string }>(), {
  href:     '/guia.pdf',
  fileName: 'manual-aluno-bcc-ufabc.pdf',
})
</script>

<template>
  <a
    :href="href"
    :download="fileName"
    class="flex items-center gap-2 h-11 px-[18px] bg-brand-azul text-white no-underline font-bold text-[14px] hover:bg-brand-azul-escuro transition-colors"
  >
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
    Baixar PDF
  </a>
</template>
