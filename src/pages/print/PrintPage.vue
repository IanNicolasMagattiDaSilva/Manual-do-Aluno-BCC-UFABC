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
 *   4. PdfGrade          — grade curricular sugerida (A4 retrato, colunas por ano)
 *
 * PdfTabela fica fora da composição: a comparação entre PPCs já entra via
 * content/bcc/ppc.md. Os dados de PdfGrade ainda são ilustrativos.
 *
 * Cada componente controla suas próprias quebras de página via
 * `h1[data-pdf-section]` (ver src/shared/styles/print.css).
 */

import PrintLayout from '@pages/_layouts/PrintLayout.vue'
import {
  PdfCapa,
  PdfSumario,
  PdfMarkdownPages,
  PdfGrade,
} from '@pages/print'
</script>

<template>
  <PrintLayout>
    <PdfCapa tema="amarelo" />
    <PdfSumario />
    <PdfMarkdownPages />
    <PdfGrade />
  </PrintLayout>
</template>
