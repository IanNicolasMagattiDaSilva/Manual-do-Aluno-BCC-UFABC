<script setup lang="ts">
/**
 * PrintLayout.vue — Layout para geração de PDF via Playwright + Paged.js.
 * Rota: /print
 *
 * Responsabilidades:
 *   1. Importa print.css — ÚNICO arquivo permitido a fazê-lo (ver ARCHITECTURE.md § 7).
 *   2. Esconde Header, Sidebar e botões via classe .no-print definida em print.css.
 *   3. Inicializa Paged.js via dynamic import após montar todo o conteúdo.
 *   4. Define window.__PAGED_DONE__ = true para sinalizar ao Playwright que a
 *      paginação está concluída e page.pdf() pode ser chamado.
 *
 * Estratégia de inicialização do Paged.js:
 *   - Tenta import('pagedjs') dinamicamente.
 *   - Se o módulo não estiver disponível (dev sem pagedjs instalado),
 *     cai no catch e define __PAGED_DONE__ = true imediatamente,
 *     permitindo que o restante da UI funcione sem quebrar.
 */

import { onMounted } from 'vue'
import '@shared/styles/print.css'

/*
 * Declaração global: apenas __PAGED_DONE__ é necessário aqui.
 * A declaração do Paged? global já existe em @shared/lib/pdf.ts.
 * Duplicar causaria erro de TS — mantemos apenas o que é novo.
 */
declare global {
  interface Window {
    __PAGED_DONE__?: boolean
  }
}

onMounted(async () => {
  try {
    /*
     * Importação dinâmica do Paged.js.
     * Usar dynamic import garante que o módulo só é carregado na rota /print,
     * sem impacto no bundle das outras rotas (tree-shaking por rota).
     * O módulo ESM oficial é 'pagedjs/dist/paged.esm.js'; o alias 'pagedjs'
     * depende do campo "exports" do package.json do pagedjs.
     * Como pagedjs é dependência opcional sem tipos TS, usamos unknown + cast.
     */
    const paged = await import('pagedjs') as unknown as {
      Previewer: new () => {
        preview(content: Element, stylesheets: string[], renderTo: Element): Promise<unknown>
      }
    }

    const previewer = new paged.Previewer()
    await previewer.preview(document.body, [], document.body)

    window.__PAGED_DONE__ = true
  } catch {
    /*
     * Fallback: pagedjs não está instalado (dependência opcional) ou
     * falhou em tempo de execução. Define __PAGED_DONE__ = true imediatamente
     * para não bloquear o Playwright no CI.
     */
    window.__PAGED_DONE__ = true
  }
})
</script>

<template>
  <!--
    .print-root: contêiner raiz da impressão.
    Header, Sidebar e controles da UI devem receber .no-print para sumir no PDF.
    O conteúdo real vem via <slot /> (páginas em src/pages/print/).
  -->
  <div class="print-root font-sans text-fg-default">

    <!-- Slot: páginas de conteúdo PDF (PdfCapa, PdfSumario, PdfParte, etc.) -->
    <slot />

  </div>
</template>
