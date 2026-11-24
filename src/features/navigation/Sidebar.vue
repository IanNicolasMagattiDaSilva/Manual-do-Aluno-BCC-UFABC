<script setup lang="ts">
/**
 * Sidebar.vue — Menu lateral do manual.
 * Convertido de Sidebar.dc.html.
 *
 * Props:
 *   atual — label da página atual (para destacar o item ativo)
 */

interface SidebarItem {
  t:    string
  href: string
}

interface SidebarSection {
  label: string
  /** Cor CSS do eyebrow label */
  c:     string
  items: SidebarItem[]
}

withDefaults(defineProps<{ atual?: string }>(), {
  atual: '',
})

const NAV: SidebarSection[] = [
  {
    label: 'Parte 1 · UFABC',
    c: '#006633',
    items: [
      { t: 'Campi e cursos',              href: '/ufabc/campi'     },
      { t: 'Matrícula e ajustes',         href: '/ufabc/matricula' },
      { t: 'Avaliação e coeficientes',    href: '/ufabc/avaliacao' },
      { t: 'Projetos e oportunidades',    href: '/ufabc/projetos'  },
    ],
  },
  {
    label: 'Parte 2 · BC&T',
    c: '#0E1726',
    items: [
      { t: 'O que é o BC&T',               href: '#' },
      { t: 'Matriz curricular',            href: '/bct/matriz' },
      { t: 'Quadrimestre ideal',           href: '#' },
      { t: 'Reprovações',                  href: '#' },
      { t: 'Conclusão e curso específico', href: '#' },
    ],
  },
  {
    label: 'Parte 3 · BCC',
    c: '#006E95',
    items: [
      { t: 'O que é o BCC',             href: '#'          },
      { t: 'Grade curricular',          href: '/bcc/grade' },
      { t: 'Diferenças entre os PPCs',  href: '/bcc/ppc'   },
      { t: 'Estágio',                   href: '#'          },
      { t: 'PGC / TCC',                 href: '#'          },
      { t: 'Conclusão do curso',        href: '#'          },
    ],
  },
]

function linkClass(item: SidebarItem, atual: string): string {
  const active = item.t === atual
  const base = 'block py-1.5 px-[14px] -ml-px no-underline border-l-2 text-[14px]'
  return active
    ? `${base} text-fg-default font-semibold border-brand-azul bg-bg-azul-soft`
    : `${base} text-fg-muted font-normal border-transparent bg-transparent hover:text-fg-default`
}
</script>

<template>
  <nav
    aria-label="Seções do manual"
    class="w-[260px] py-10 font-sans text-[14px] leading-[1.5] text-fg-default box-border shrink-0"
  >
    <div
      v-for="sec in NAV"
      :key="sec.label"
      class="mb-7"
    >
      <!-- Eyebrow label da seção -->
      <p
        class="m-0 mb-2 font-mono text-[12px] font-bold tracking-[3px] uppercase"
        :style="{ color: sec.c }"
      >
        {{ sec.label }}
      </p>

      <!-- Lista de páginas -->
      <ul class="list-none m-0 p-0 border-l-2 border-border-subtle">
        <li v-for="item in sec.items" :key="item.t">
          <!-- Usar <a> para hrefs com '#', RouterLink para rotas reais -->
          <RouterLink
            v-if="!item.href.startsWith('#')"
            :to="item.href"
            :class="linkClass(item, atual)"
          >
            {{ item.t }}
          </RouterLink>
          <a
            v-else
            :href="item.href"
            :class="linkClass(item, atual)"
          >
            {{ item.t }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
