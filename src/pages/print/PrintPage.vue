<script setup lang="ts">
/**
 * PrintPage.vue — Composição completa do PDF do Manual do Aluno.
 * Rota: /print
 *
 * Ordem das páginas do PDF:
 *   1. PdfCapa       — capa (sem cabeçalho/rodapé via @page :first)
 *   2. PdfSumario    — índice paginado
 *   3. PdfParte 1    — abertura "Parte 1 · UFABC"
 *   4. PdfTexto      — páginas de texto da Parte 1
 *   5. PdfParte 2    — abertura "Parte 2 · BC&T"
 *   6. PdfParte 3    — abertura "Parte 3 · BCC"
 *   7. PdfTabela     — comparação entre PPCs
 *   8. PdfGrade      — grade curricular (A4 landscape)
 *
 * Cada componente controla suas próprias quebras de página via
 * `h1[data-pdf-section]` (ver src/shared/styles/print.css).
 *
 * A ordem acima é um ponto de partida — pode ser ajustada quando o loader de
 * markdown for conectado e o conteúdo real do manual determinar a ordenação.
 */

import PrintLayout from '@pages/_layouts/PrintLayout.vue'
import {
  PdfCapa,
  PdfSumario,
  PdfParte,
  PdfTexto,
  PdfTabela,
  PdfGrade,
} from '@pages/print'
</script>

<template>
  <PrintLayout>
    <PdfCapa    tema="amarelo" />
    <PdfSumario />
    <PdfParte   numero="1" titulo="UFABC"  subtitulo="Visão organizacional"            tema="amarelo" />
    <PdfTexto />
    <PdfParte   numero="2" titulo="BC&T"   subtitulo="Bacharelado em Ciência e Tecnologia" tema="amarelo" />
    <PdfParte   numero="3" titulo="BCC"    subtitulo="Bacharelado em Ciência da Computação" tema="azul" />
    <PdfTabela />
    <PdfGrade />
  </PrintLayout>
</template>
