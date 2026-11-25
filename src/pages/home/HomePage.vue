<script setup lang="ts">
/**
 * HomePage.vue — Página inicial do Manual do Aluno BCC UFABC.
 * Convertida de Main.dc.html.
 *
 * Props:
 *   tema — variante de cor do hero: 'amarelo' | 'azul'
 */

import { computed, ref } from 'vue'
import { Header } from '@features/navigation'
import { SearchInput } from '@features/search'
import { DownloadPdfButton } from '@features/pdf-export'
import { Wafer } from '@shared/ui/Wafer'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'
import type { SectionItem } from '@entities/section/types'

interface Fact {
  big:   string
  label: string
  /** Cor CSS do número e da borda superior (via style inline, pois são tokens distintos por item) */
  c:     string
}

interface Part {
  num:   string
  title: string
  sub:   string
  /** Cor de fundo do cabeçalho do card (valor fixo de tokens) */
  bg:    string
  /** Cor do chip/eyebrow dentro do cabeçalho */
  chip:  string
  items: SectionItem[]
}

const props = withDefaults(defineProps<{ tema?: Tema }>(), {
  tema: 'amarelo',
})

const t = computed(() => themes[props.tema])

const query = ref('')

const parts: Part[] = [
  {
    num:  'Parte 1',
    title: 'UFABC',
    sub:  'Visão organizacional',
    bg:   '#006633',
    chip: '#FFCC00',
    items: [
      { t: 'Campi e cursos',                href: '/ufabc/campi',    n: '01' },
      { t: 'Sistema quadrimestral',         href: '#',               n: '02' },
      { t: 'Matrícula e ajustes',           href: '/ufabc/matricula', n: '03' },
      { t: 'Cancelamento de disciplinas',   href: '#',               n: '04' },
      { t: 'Avaliação e coeficientes',      href: '/ufabc/avaliacao', n: '05' },
      { t: 'Projetos, monitoria e pesquisa',href: '/ufabc/projetos',  n: '06' },
    ],
  },
  {
    num:  'Parte 2',
    title: 'BC&T',
    sub:  'Bacharelado em Ciência e Tecnologia',
    bg:   '#0E1726',
    chip: '#FFCC00',
    items: [
      { t: 'O que é o BC&T',                href: '/bct/sobre',              n: '07' },
      { t: 'Projeto pedagógico (PPC)',       href: '/bct/sobre#plano-pedagogico-ppc',              n: '08' },
      { t: 'Matriz curricular',             href: '/bct/matriz',    n: '09' },
      { t: 'Quadrimestre ideal',            href: '/bct/matriz#quadrimestre-ideal',              n: '10' },
      { t: 'Extensão e horas complementares',href: '/bct/extensao',             n: '11' },
      { t: 'Conclusão e curso específico',  href: '/bct/extensao#conclusao-de-curso',              n: '12' },
    ],
  },
  {
    num:  'Parte 3',
    title: 'BCC',
    sub:  'Bacharelado em Ciência da Computação',
    bg:   '#006E95',
    chip: '#FFFFFF',
    items: [
      { t: 'O que é o BCC',            href: '/bcc/sobre',          n: '13' },
      { t: 'Plano pedagógico',         href: '/bcc/sobre#plano-pedagogico',          n: '14' },
      { t: 'Matriz curricular',        href: '/bcc/grade', n: '15' },
      { t: 'Diferenças entre os PPCs', href: '/bcc/ppc',   n: '16' },
      { t: 'Estágio',                  href: '/bcc/sobre#estagio',          n: '17' },
      { t: 'PGC / TCC e conclusão',    href: '/bcc/sobre#pgc-tcc-projeto-de-conclusao-de-curso',          n: '18' },
    ],
  },
]

const facts: Fact[] = [
  { big: '3×12',    label: 'Três quadrimestres por ano, de 12 semanas cada', c: '#FFCC00' },
  { big: '2.400 h', label: 'Carga horária total do BC&T',                   c: '#FFCC00' },
  { big: '3.280 h', label: 'Carga horária total do BCC (PPC 2023)',         c: '#3FB8E5' },
  { big: '328 h',   label: 'De extensão, requisito para colar grau no BCC', c: '#3FB8E5' },
]
</script>

<template>
  <div class="min-h-screen bg-bg-default text-fg-default font-sans text-[16px] leading-[1.6]">

    <!-- Header -->
    <Header ativo="inicio">
      <template #actions>
        <SearchInput v-model="query" />
        <DownloadPdfButton />
      </template>
    </Header>

    <!-- Hero -->
    <section
      class="w-full relative overflow-hidden"
      :style="{ background: t.bg }"
    >
      <!-- Wafer decorativo -->
      <div
        aria-hidden="true"
        class="absolute right-0 top-0 w-[960px] h-[720px]"
      >
        <Wafer
          :tema="tema"
          :w="960"
          :h="720"
          :die="128"
          :ax="1"
          :ay="0.35"
          :seed="7"
          :fundo="false"
        />
      </div>

      <div class="relative max-w-[var(--width-content-home)] mx-auto px-8 pt-28 pb-[120px] box-border">
        <!-- Eyebrow com cursor piscante -->
        <p
          class="m-0 mb-5 font-mono text-[14px] font-bold tracking-[4px] uppercase"
          :style="{ color: t.text }"
        >
          &gt; Universidade Federal do ABC<span
            class="inline-block w-[10px] h-[18px] align-[-3px] ml-[6px]"
            :style="{ background: t.text }"
          />
        </p>

        <!-- Título principal -->
        <h1
          class="m-0 font-display font-normal [font-size:clamp(64px,9vw,128px)] leading-[0.95] uppercase tracking-[0.5px]"
          :style="{ color: t.title }"
        >
          Manual<br>do aluno
        </h1>

        <!-- Subtítulo -->
        <p
          class="mt-5 mb-0 text-[22px] font-semibold"
          :style="{ color: t.text }"
        >
          Do BC&amp;T à Ciência da Computação
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-3 mt-10">
          <RouterLink
            to="/ufabc/campi"
            class="flex items-center h-[52px] px-6 bg-fg-default text-bg-default no-underline font-semibold"
          >
            Começar a leitura →
          </RouterLink>
          <RouterLink
            to="/"
            class="flex items-center h-[52px] px-6 border-2 no-underline font-semibold box-border"
            :style="{ borderColor: t.text, color: t.text }"
          >
            Ver índice
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Grade de seções -->
    <section class="max-w-[var(--width-content-home)] mx-auto px-8 pt-24 pb-12 box-border">
      <!-- Cabeçalho da seção -->
      <p class="m-0 mb-2 font-mono text-[13px] font-bold tracking-[4px] uppercase text-brand-verde">
        Índice
      </p>
      <h2 class="m-0 mb-2 font-display font-normal text-[56px] leading-none uppercase text-fg-default">
        O que você vai encontrar aqui
      </h2>
      <p class="m-0 mb-12 text-fg-muted text-[18px] max-w-[640px]">
        O manual está dividido em três partes, da universidade como um todo até o curso de Ciência da Computação.
      </p>

      <!-- Cards de partes -->
      <div class="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-6">
        <article
          v-for="part in parts"
          :key="part.num"
          class="border-2 border-fg-default flex flex-col bg-bg-default"
        >
          <!-- Cabeçalho colorido do card -->
          <div
            class="px-6 pt-6 pb-5 text-bg-default"
            :style="{ background: part.bg }"
          >
            <p
              class="m-0 font-mono text-[12px] font-bold tracking-[3px] uppercase"
              :style="{ color: part.chip }"
            >
              {{ part.num }}
            </p>
            <h3 class="mt-[6px] mb-0.5 font-display font-normal text-[40px] leading-[1.05] uppercase text-bg-default">
              {{ part.title }}
            </h3>
            <p class="m-0 text-[14px] text-bg-default">
              {{ part.sub }}
            </p>
          </div>

          <!-- Lista de capítulos -->
          <ul class="list-none m-0 px-6 pt-3 pb-5 flex flex-col">
            <li
              v-for="item in part.items"
              :key="item.t"
              class="border-b border-border-subtle last:border-b-0"
            >
              <RouterLink
                v-if="!item.href.startsWith('#')"
                :to="item.href"
                class="flex justify-between gap-3 py-[10px] no-underline text-fg-default text-[15px]"
              >
                <span>{{ item.t }}</span>
                <span class="font-mono text-[13px] text-fg-muted">{{ item.n }}</span>
              </RouterLink>
              <a
                v-else
                href="#"
                class="flex justify-between gap-3 py-[10px] no-underline text-fg-default text-[15px]"
              >
                <span>{{ item.t }}</span>
                <span class="font-mono text-[13px] text-fg-muted">{{ item.n }}</span>
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- Strip de fatos em fundo escuro -->
    <section class="max-w-[var(--width-content-home)] mx-auto px-8 py-12 box-border">
      <div class="bg-fg-default text-bg-default p-12 grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-8">
        <div
          v-for="f in facts"
          :key="f.big"
          class="flex flex-col gap-2 border-t-4 pt-4"
          :style="{ borderColor: f.c }"
        >
          <span
            class="font-display text-[56px] leading-none"
            :style="{ color: f.c }"
          >
            {{ f.big }}
          </span>
          <span class="text-[15px] text-fg-on-dark-muted">
            {{ f.label }}
          </span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t-4 border-brand-verde bg-bg-surface">
      <div class="max-w-[var(--width-content-home)] mx-auto px-8 py-8 flex flex-wrap justify-between items-center gap-4 text-[14px] text-fg-muted">
        <span>Material produzido por [SEU NOME] · Graduando(a) em Ciência da Computação</span>
        <span class="font-mono text-[13px]">Fontes: prograd.ufabc.edu.br · ufabc.edu.br</span>
      </div>
    </footer>

  </div>
</template>
