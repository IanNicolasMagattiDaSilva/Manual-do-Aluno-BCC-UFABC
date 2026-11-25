<script setup lang="ts">
/**
 * PdfCapa.vue — Capa do PDF (primeira página, full-bleed A4).
 * Layout fiel à amostra v1:
 *   - Hero amarelo (~62% da altura) com wafer; eyebrow, título e subtítulo
 *     alinhados na base do hero.
 *   - Bloco branco: "Material produzido por" (esq.) e conteúdo (dir.).
 *   - Faixa verde + rodapé escuro com logo BCC e edição.
 */

import { computed } from 'vue'
import { Wafer } from '@shared/ui/Wafer'
import { Logo }  from '@shared/ui/Logo'
import { themes } from '@shared/config/tokens'
import type { Tema } from '@shared/config/tokens'

const props = withDefaults(defineProps<{
  tema?: Tema
  nome?: string
  edicao?: string
  seed?: number
}>(), {
  tema: 'amarelo',
  nome: '[SEU NOME]',
  edicao: '[ANO]',
  seed: 3,
})

const t = computed(() => themes[props.tema])

const partes = ['Parte 1 · UFABC', 'Parte 2 · BC&T', 'Parte 3 · BCC']
</script>

<template>
  <article class="pdf-capa">
    <div class="pdf-capa__hero" :style="{ background: t.bg }">
      <div aria-hidden="true" class="pdf-capa__wafer">
        <Wafer :tema="tema" :w="794" :h="700" :die="112" :ax="1" :ay="0" :seed="seed" :fundo="false" />
      </div>

      <div class="pdf-capa__hero-text">
        <p class="pdf-capa__eyebrow" :style="{ color: t.text }">&gt; Universidade Federal do ABC</p>
        <h1 class="pdf-capa__title" :style="{ color: t.title }">Manual<br>do Aluno</h1>
        <p class="pdf-capa__sub" :style="{ color: t.text }">Do BC&amp;T à Ciência da Computação</p>
      </div>
    </div>

    <div class="pdf-capa__meta">
      <div>
        <p class="pdf-capa__label">Material produzido por</p>
        <p class="pdf-capa__nome">{{ nome }}</p>
        <p class="pdf-capa__curso">Graduando(a) em Ciência da Computação</p>
      </div>
      <div class="pdf-capa__conteudo">
        <p class="pdf-capa__label">Conteúdo</p>
        <p v-for="p in partes" :key="p" class="pdf-capa__parte">{{ p }}</p>
      </div>
    </div>

    <div class="pdf-capa__stripe" />
    <div class="pdf-capa__foot">
      <Logo :cell="4" color="#3FB8E5" />
      <span class="pdf-capa__edicao">Edição {{ edicao }}</span>
    </div>
  </article>
</template>

<style scoped>
.pdf-capa {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 296mm;
  overflow: hidden;
  background: #fff;
  color: var(--color-fg-default);
  font-family: var(--font-sans);
}
.pdf-capa__hero {
  position: relative;
  flex: 0 0 62.2%;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.pdf-capa__wafer { position: absolute; inset: 0; }
.pdf-capa__hero-text { position: relative; padding: 0 72px 80px; }
.pdf-capa__eyebrow {
  margin: 0 0 14px;
  font: 700 13px/1 var(--font-mono);
  letter-spacing: 6px;
  text-transform: uppercase;
}
.pdf-capa__title {
  margin: 0;
  font: 400 128px/0.98 var(--font-display);
  text-transform: uppercase;
}
.pdf-capa__sub { margin: 22px 0 0; font: 600 20px/1.2 var(--font-sans); }
.pdf-capa__meta {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 44px 72px 0;
}
.pdf-capa__label {
  margin: 0 0 8px;
  font: 400 11px/1 var(--font-mono);
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #5A6472;
}
.pdf-capa__nome { margin: 0; font: 700 20px/1.2 var(--font-sans); }
.pdf-capa__curso { margin: 6px 0 0; font: 400 14px/1.4 var(--font-sans); color: #4A5568; }
.pdf-capa__conteudo { text-align: right; }
.pdf-capa__parte { margin: 0 0 5px; font: 400 15px/1.4 var(--font-sans); }
.pdf-capa__stripe { height: 6px; background: var(--color-brand-verde); flex-shrink: 0; }
.pdf-capa__foot {
  flex: 0 0 9.8%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 72px;
  background: var(--color-fg-default);
}
.pdf-capa__edicao { font: 400 12px/1 var(--font-mono); letter-spacing: 1px; color: #fff; }
</style>
