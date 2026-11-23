<script setup lang="ts">
/**
 * Wafer.vue — Padrão decorativo de wafer de silício.
 * Convertido de Wafer.dc.html.
 *
 * Props mapeiam 1:1 com as props do mockup original.
 * O algoritmo de partição recursiva (split) está preservado.
 */

import { computed } from 'vue'
import type { Tema } from '@shared/config/tokens'

interface Props {
  tema?:  Tema
  w?:     number
  h?:     number
  die?:   number
  /** Foco X: fração da largura (0–1) */
  ax?:    number
  /** Foco Y: fração da altura (0–1) */
  ay?:    number
  seed?:  number
  fundo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tema:  'amarelo',
  w:     480,
  h:     480,
  die:   96,
  ax:    1,
  ay:    0.2,
  seed:  7,
  fundo: true,
})

interface Rect {
  x: number
  y: number
  w: number
  h: number
  bg: string
  o: string
}

interface WaferData {
  rects: Rect[]
  bg:    string
}

const data = computed<WaferData>(() => {
  const { w, h, die, seed, fundo } = props
  const ax = props.ax * w
  const ay = props.ay * h

  // LCG pseudo-random (mesmo algoritmo do mockup)
  let s = seed
  const r = () => {
    s = (s * 16807) % 2_147_483_647
    return (s - 1) / 2_147_483_646
  }

  const P = props.tema === 'azul'
    ? { base: '#008BBB', fills: ['#0892C3', '#0786B5', '#0D97C7', '#0781AE'] }
    : { base: '#FFCC00', fills: ['#FFD31F', '#FAC600', '#FFD838', '#F5C100'] }

  const g       = Math.max(4, Math.round(die / 16))
  const minSide = Math.max(10, die / 7)
  const rects: Rect[] = []

  const leaf = (x: number, y: number, rw: number, rh: number, o: number) => {
    const fill = P.fills[Math.floor(r() * P.fills.length)]
    rects.push({
      x:  Math.round(x + g / 2),
      y:  Math.round(y + g / 2),
      w:  Math.round(rw - g),
      h:  Math.round(rh - g),
      bg: fill,
      o:  o.toFixed(2),
    })
  }

  const split = (
    x: number, y: number,
    rw: number, rh: number,
    depth: number, maxD: number, o: number,
  ) => {
    if (
      depth >= maxD ||
      Math.min(rw, rh) < minSide * 2 ||
      (depth > 0 && r() < 0.3)
    ) {
      return leaf(x, y, rw, rh, o)
    }
    const v = r()
    if (v < 0.35) {
      const hw = rw / 2, hh = rh / 2
      split(x,      y,      hw, hh, depth + 1, maxD, o)
      split(x + hw, y,      hw, hh, depth + 1, maxD, o)
      split(x,      y + hh, hw, hh, depth + 1, maxD, o)
      split(x + hw, y + hh, hw, hh, depth + 1, maxD, o)
    } else {
      const k = [1 / 3, 1 / 2, 2 / 3][Math.floor(r() * 3)]
      if (rw >= rh) {
        split(x,         y, rw * k,       rh, depth + 1, maxD, o)
        split(x + rw * k, y, rw * (1 - k), rh, depth + 1, maxD, o)
      } else {
        split(x, y,         rw, rh * k,       depth + 1, maxD, o)
        split(x, y + rh * k, rw, rh * (1 - k), depth + 1, maxD, o)
      }
    }
  }

  const cols  = Math.ceil(w / die) + 1
  const rows  = Math.ceil(h / die) + 1
  const reach = Math.hypot(Math.max(ax, w - ax), Math.max(ay, h - ay)) * 0.9

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * die - die / 4
      const cy = row * die - die / 4
      const t  = 1 - Math.hypot(cx + die / 2 - ax, cy + die / 2 - ay) / reach
      if (t <= 0 || r() > t * 1.7) continue
      const maxD = t > 0.62 ? 3 : t > 0.35 ? 2 : 1
      split(cx, cy, die, die, 0, maxD, Math.min(0.9, t * 1.3))
    }
  }

  return {
    rects,
    bg: fundo ? P.base : 'transparent',
  }
})
</script>

<template>
  <div
    aria-hidden="true"
    class="relative overflow-hidden"
    :style="{ width: `${w}px`, height: `${h}px`, background: data.bg }"
  >
    <div
      v-for="(d, i) in data.rects"
      :key="i"
      class="absolute rounded-sm box-border"
      :style="{
        left:       `${d.x}px`,
        top:        `${d.y}px`,
        width:      `${d.w}px`,
        height:     `${d.h}px`,
        background: d.bg,
        opacity:    d.o,
      }"
    />
  </div>
</template>
