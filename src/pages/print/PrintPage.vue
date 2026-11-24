<script setup lang="ts">
/**
 * PrintPage.vue — Composição completa do PDF do Manual do Aluno.
 * Rota: /print
 *
 * Ordem das páginas do PDF:
 *   1. PdfCapa           — capa (sem cabeçalho/rodapé via @page :first)
 *   2. PdfSumario        — índice paginado
 *   3. PdfMarkdownPages  — partes 1-3 geradas a partir de content/*.md
 *                          (insere PdfParte antes das páginas de cada seção)
 *   4. PdfTabela         — comparação entre PPCs (layout customizado)
 *   5. PdfGrade          — grade curricular (A4 landscape, layout customizado)
 *
 * Cada componente controla suas próprias quebras de página via
 * `h1[data-pdf-section]` (ver src/shared/styles/print.css).
 */

import PrintLayout from '@pages/_layouts/PrintLayout.vue'
import {
  PdfCapa,
  PdfSumario,
  PdfMarkdownPages,
  PdfTabela,
  PdfGrade,
} from '@pages/print'
</script>

<template>
  <PrintLayout>
    <PdfCapa tema="amarelo" />
    <PdfSumario />
    <PdfMarkdownPages />
    <PdfTabela />
    <PdfGrade />
  </PrintLayout>
</template>
