<script setup lang="ts">
/**
 * PrevNext.vue — Navegação anterior/próxima entre páginas.
 * Padrão visual extraído de Pagina.dc.html.
 */

interface PageLink {
  label: string
  to:    string
}

defineProps<{
  prev?: PageLink | null
  next?: PageLink | null
}>()
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mt-16">

    <!-- Anterior -->
    <RouterLink
      v-if="prev"
      :to="prev.to"
      class="border-2 border-border-subtle p-5 no-underline text-fg-default flex flex-col gap-1 hover:border-border-strong transition-colors"
    >
      <span class="font-mono text-[12px] tracking-[2px] uppercase text-fg-muted">
        &larr; Anterior
      </span>
      <span class="font-semibold text-[17px]">{{ prev.label }}</span>
    </RouterLink>
    <div v-else />

    <!-- Próxima -->
    <RouterLink
      v-if="next"
      :to="next.to"
      class="border-2 border-brand-azul p-5 no-underline text-fg-default flex flex-col gap-1 text-right hover:bg-bg-azul-soft transition-colors"
    >
      <span class="font-mono text-[12px] tracking-[2px] uppercase text-brand-azul-escuro">
        Próxima &rarr;
      </span>
      <span class="font-semibold text-[17px]">{{ next.label }}</span>
    </RouterLink>
    <div v-else />

  </div>
</template>
