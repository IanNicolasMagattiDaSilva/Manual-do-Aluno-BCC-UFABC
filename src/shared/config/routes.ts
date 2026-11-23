/**
 * routes.ts — Lista central de rotas.
 * O router.ts importa daqui. Adicionar novas rotas só neste arquivo.
 */

export interface RouteEntry {
  path: string
  name: string
  /** Label exibida no nav ou breadcrumb */
  label: string
  /** Seção do nav principal: 'inicio' | 'ufabc' | 'bct' | 'bcc' */
  nav: 'inicio' | 'ufabc' | 'bct' | 'bcc' | 'print'
}

export const ROUTES: RouteEntry[] = [
  { path: '/',                    name: 'home',            label: 'Início',                     nav: 'inicio' },
  { path: '/ufabc/campi',         name: 'ufabc-campi',     label: 'Campi e cursos',              nav: 'ufabc'  },
  { path: '/ufabc/matricula',     name: 'ufabc-matricula', label: 'Matrícula e ajustes',          nav: 'ufabc'  },
  { path: '/ufabc/avaliacao',     name: 'ufabc-avaliacao', label: 'Avaliação e coeficientes',     nav: 'ufabc'  },
  { path: '/ufabc/projetos',      name: 'ufabc-projetos',  label: 'Projetos e oportunidades',     nav: 'ufabc'  },
  { path: '/bct/matriz',          name: 'bct-matriz',      label: 'Matriz curricular',            nav: 'bct'   },
  { path: '/bcc/grade',           name: 'bcc-grade',       label: 'Grade curricular',             nav: 'bcc'   },
  { path: '/bcc/ppc',             name: 'bcc-ppc',         label: 'Diferenças entre os PPCs',     nav: 'bcc'   },
  { path: '/print',               name: 'print',           label: 'PDF',                          nav: 'print' },
]
