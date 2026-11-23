<script setup lang="ts">
/**
 * PdfSumario.vue — Índice paginado do PDF.
 * Convertido de PdfSumario.dc.html (mockup placeholder → spec da issue).
 *
 * Renderiza o sumário completo do manual com entradas agrupadas por parte.
 * Cada entrada `.toc-link` recebe `::after { content: target-counter(…) }`
 * do print.css para exibir o número de página automaticamente via Paged.js.
 *
 * NOTA: layout absoluto apenas para visualização web; na impressão quem controla é @page.
 *
 * Props:
 *   tema — 'amarelo' | 'azul' (default: 'amarelo')
 */

import { computed } from 'vue'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  tema?: Tema
}>(), {
  tema: 'amarelo',
})

const t = computed(() => themes[props.tema])

/** Estrutura do sumário — entradas ligadas por âncoras de seção */
interface TocEntry {
  id:    string   // âncora href destino (ex: "#parte-1")
  nivel: 1 | 2   // 1 = parte, 2 = seção
  label: string  // eyebrow ("Parte 1")
  texto: string  // título da entrada
}

const entradas: TocEntry[] = [
  { id: '#parte-1',       nivel: 1, label: 'Parte 01', texto: 'UFABC — A universidade e seus campi'              },
  { id: '#campi',         nivel: 2, label: '',          texto: 'Campi Santo André e São Bernardo'                 },
  { id: '#matricula',     nivel: 2, label: '',          texto: 'Matrícula e trancamento'                          },
  { id: '#avaliacao',     nivel: 2, label: '',          texto: 'Sistema de avaliação'                             },
  { id: '#projetos',      nivel: 2, label: '',          texto: 'Iniciação científica e projetos'                  },
  { id: '#parte-2',       nivel: 1, label: 'Parte 02', texto: 'BCT — Bacharelado em Ciência e Tecnologia'        },
  { id: '#bct-matriz',    nivel: 2, label: '',          texto: 'Matriz curricular BCT'                            },
  { id: '#bct-eixos',     nivel: 2, label: '',          texto: 'Eixos de formação'                                },
  { id: '#bct-opcoes',    nivel: 2, label: '',          texto: 'Opções de terminalidade'                          },
  { id: '#parte-3',       nivel: 1, label: 'Parte 03', texto: 'BCC — Bacharelado em Ciência da Computação'       },
  { id: '#bcc-grade',     nivel: 2, label: '',          texto: 'Grade curricular BCC'                             },
  { id: '#bcc-ppc',       nivel: 2, label: '',          texto: 'Projeto Pedagógico do Curso'                      },
  { id: '#bcc-carreira',  nivel: 2, label: '',          texto: 'Perspectivas de carreira'                         },
]
</script>

<template>
  <!--
    Página de sumário: margem controlada pelo @page no print.css.
    Na web, padding px-14 py-10 simula a margem de 2cm.
  -->
  <article class="w-full min-h-screen font-sans text-fg-default bg-bg-default px-14 py-10">

    <!-- ═══════════════════════════════════════════════════════
         Cabeçalho do sumário
    ════════════════════════════════════════════════════════════ -->
    <header class="mb-10 pb-6 border-b border-border-strong">
      <!-- Eyebrow -->
      <p class="font-mono text-[11px] font-bold tracking-[4px] uppercase text-fg-muted mb-2">
        Manual do Aluno · BCC UFABC
      </p>

      <!-- Título da página: data-pdf-section captura via string-set no print.css -->
      <h1
        class="font-display text-[48px] leading-none uppercase text-fg-default"
        data-pdf-section
      >
        Sumário
      </h1>
    </header>

    <!-- ═══════════════════════════════════════════════════════
         Lista do sumário
    ════════════════════════════════════════════════════════════ -->
    <nav aria-label="Sumário do manual">
      <ol class="list-none m-0 p-0 flex flex-col">
        <template v-for="entrada in entradas" :key="entrada.id">

          <!-- Entrada de PARTE (nível 1) -->
          <li
            v-if="entrada.nivel === 1"
            class="mt-8 mb-2 first:mt-0"
          >
            <!-- Eyebrow da parte -->
            <p
              class="font-mono text-[10px] font-bold tracking-[3px] uppercase mb-1"
              :style="{ color: t.bg }"
            >
              {{ entrada.label }}
            </p>

            <!-- Link da parte com número de página via Paged.js -->
            <a
              :href="entrada.id"
              class="toc-link flex items-baseline font-display text-[22px] uppercase leading-tight text-fg-default no-underline border-b border-border-subtle pb-2"
            >
              <span class="flex-1">{{ entrada.texto }}</span>
            </a>
          </li>

          <!-- Entrada de SEÇÃO (nível 2) -->
          <li
            v-else
            class="border-b border-border-subtle"
          >
            <a
              :href="entrada.id"
              class="toc-link flex items-baseline py-2 font-sans text-[15px] text-fg-strong no-underline hover:text-fg-default"
            >
              <!-- Recuo visual para sub-itens -->
              <span class="w-6 shrink-0" aria-hidden="true" />
              <span class="flex-1">{{ entrada.texto }}</span>
              <!-- Número de página: .toc-link::after em print.css injetará via target-counter -->
            </a>
          </li>

        </template>
      </ol>
    </nav>

  </article>
</template>
