/**
 * pdf.ts — Stub do integrador Paged.js.
 *
 * O PrintLayout.vue chama initPaged() após renderizar todo o conteúdo.
 * Quando o Paged.js terminar a paginação, define window.__PAGED_DONE__ = true,
 * que é o sinal que o script Playwright espera antes de chamar page.pdf().
 *
 * Declaração global para satisfazer o TypeScript:
 */
declare global {
  interface Window {
    __PAGED_DONE__?: boolean
    // Paged.js expõe um objeto global quando carregado via CDN/script tag
    Paged?: { registerHandlers: (cls: unknown) => void }
  }
}

/**
 * Inicializa o Paged.js na rota /print.
 * @stub — apenas define __PAGED_DONE__ = true imediatamente.
 *
 * Implementação real (Fase 4):
 *   1. import('pagedjs/dist/paged.esm.js')
 *   2. new Paged.Previewer().preview(document.body, [], document)
 *   3. .then(() => { window.__PAGED_DONE__ = true })
 */
export async function initPaged(): Promise<void> {
  // TODO (Fase 4): carregar Paged.js e aguardar paginação
  window.__PAGED_DONE__ = true
}
