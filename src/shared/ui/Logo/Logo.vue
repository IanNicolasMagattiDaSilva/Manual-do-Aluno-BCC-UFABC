<script setup lang="ts">
/**
 * Logo.vue — Logotipo BCC em pixel art.
 * Convertido de Logo.dc.html.
 *
 * Props:
 *   cell  — tamanho de cada pixel em px (default: 30)
 *   color — cor de preenchimento (default: #008BBB / brand-azul)
 */

interface Props {
  cell?:  number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  cell:  30,
  color: '#008BBB',
})

/** Grid bitmap do BCC (1 = pixel aceso, . = vazio) */
const GRID = [
  '11111...........',
  '11..11..........',
  '11..11..111..111',
  '11111..11...11..',
  '11..11.11...11..',
  '11..11.11...11..',
  '11111...111..111',
]

interface Cell {
  x: number
  y: number
  s: number
}

interface LogoData {
  cells: Cell[]
  w:     number
  h:     number
}

function compute(cellSize: number): LogoData {
  const s   = cellSize
  const gap = Math.max(1, Math.round(s / 8))
  const cells: Cell[] = []

  GRID.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '1') {
        cells.push({ x: c * s, y: r * s, s: s - gap })
      }
    }
  })

  return {
    cells,
    w: 16 * s - gap,
    h:  7 * s - gap,
  }
}

import { computed } from 'vue'

const logo = computed(() => compute(props.cell))
</script>

<template>
  <div
    role="img"
    aria-label="BCC"
    class="relative shrink-0"
    :style="{ width: `${logo.w}px`, height: `${logo.h}px` }"
  >
    <div
      v-for="(c, i) in logo.cells"
      :key="i"
      class="absolute"
      :style="{
        left:       `${c.x}px`,
        top:        `${c.y}px`,
        width:      `${c.s}px`,
        height:     `${c.s}px`,
        background: color,
      }"
    />
  </div>
</template>
