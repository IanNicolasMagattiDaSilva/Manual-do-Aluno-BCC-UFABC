/**
 * src/pages/print/index.ts — Exporta as páginas do PDF.
 *
 * Uso no PrintLayout.vue (ou em qualquer composição em pages/):
 *   import { PdfCapa, PdfSumario, PdfParte } from '@pages/print'
 *
 * Ordem de inclusão no PDF final (definida no PrintLayout):
 *   1. PdfCapa    — capa (primeira página, sem cabeçalho/rodapé via @page :first)
 *   2. PdfSumario — índice paginado
 *   3. PdfParte   — abertura de cada uma das 3 partes (instanciada 3×)
 */

export { default as PdfCapa }    from './PdfCapa.vue'
export { default as PdfSumario } from './PdfSumario.vue'
export { default as PdfParte }   from './PdfParte.vue'
export { default as PdfTexto }   from './PdfTexto.vue'
export { default as PdfTabela }  from './PdfTabela.vue'
export { default as PdfGrade }   from './PdfGrade.vue'
export { default as PrintPage }  from './PrintPage.vue'
