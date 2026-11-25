import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * Lazy-loading por rota: cada page vira um chunk separado.
 * Benefício: o bundle inicial carrega só a home; ao navegar, a page do
 * destino é buscada sob demanda. Para gerar o PDF via Playwright, a
 * rota /print continua funcionando (o Previewer do Paged.js aguarda
 * o DOM estar completo).
 *
 * Os imports usam os barrels de cada pasta (ex: '@pages/home' → HomePage).
 * Caso uma page ainda não exista, aponte para PlaceholderPage e deixe
 * um comentário TODO ao lado da rota.
 */

/** Rotas cujo conteúdo vem de content/*.md, renderizado por MarkdownPage. */
function mdRoutes(entries: [path: string, name: string, section: string, title: string][]): RouteRecordRaw[] {
  return entries.map(([path, name, section, title]) => ({
    path,
    name,
    component: () => import('@pages/content').then(m => m.MarkdownPage),
    meta:      { section, title },
  }))
}

const routes: RouteRecordRaw[] = [
  {
    path:      '/',
    name:      'home',
    component: () => import('@pages/home').then(m => m.HomePage),
    meta:      { section: 'inicio', title: 'Início' },
  },

  /* ---------- Parte 1 · UFABC ---------- */
  {
    path:      '/ufabc/campi',
    name:      'ufabc-campi',
    component: () => import('@pages/ufabc').then(m => m.CampiPage),
    meta:      { section: 'ufabc', title: 'Campi e cursos' },
  },
  {
    path:      '/ufabc/matricula',
    name:      'ufabc-matricula',
    component: () => import('@pages/ufabc').then(m => m.MatriculaPage),
    meta:      { section: 'ufabc', title: 'Matrícula e ajustes' },
  },
  {
    path:      '/ufabc/avaliacao',
    name:      'ufabc-avaliacao',
    component: () => import('@pages/ufabc').then(m => m.AvaliacaoPage),
    meta:      { section: 'ufabc', title: 'Avaliação e coeficientes' },
  },
  {
    path:      '/ufabc/projetos',
    name:      'ufabc-projetos',
    component: () => import('@pages/ufabc').then(m => m.ProjetosPage),
    meta:      { section: 'ufabc', title: 'Projetos e oportunidades' },
  },

  /* ---------- Parte 2 · BC&T ----------
   * Páginas geradas a partir de content/bct/*.md (mesma fonte do PDF).
   */
  ...mdRoutes([
    ['/bct/sobre',    'bct-sobre',    'bct', 'O que é o BC&T'],
    ['/bct/matriz',   'bct-matriz',   'bct', 'Matriz curricular do BC&T'],
    ['/bct/extensao', 'bct-extensao', 'bct', 'Extensão, apoio e formação complementar'],
  ]),

  /* ---------- Parte 3 · BCC ----------
   * Páginas geradas a partir de content/bcc/*.md (mesma fonte do PDF).
   */
  ...mdRoutes([
    ['/bcc/sobre', 'bcc-sobre', 'bcc', 'O que é o BCC'],
    ['/bcc/grade', 'bcc-grade', 'bcc', 'Grade curricular do BCC'],
    ['/bcc/ppc',   'bcc-ppc',   'bcc', 'Diferenças entre os PPCs'],
  ]),

  /* ---------- Rota do PDF ----------
   * Renderiza PrintPage, que compõe PrintLayout + todas as páginas /pdf/.
   * Usada pelo scripts/generate-pdf.ts (Playwright → page.pdf()).
   */
  {
    path:      '/print',
    name:      'print',
    component: () => import('@pages/print').then(m => m.PrintPage),
    meta:      { title: 'Manual — PDF' },
  },

  /* ---------- Fallback ---------- */
  {
    path:      '/:pathMatch(.*)*',
    name:      'not-found',
    component: () => import('@pages/placeholder/PlaceholderPage.vue'),
    props:     { title: 'Página não encontrada', section: 'inicio' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash)       return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
