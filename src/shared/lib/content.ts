/**
 * content.ts — Stub do loader de conteúdo Markdown.
 * Responsável por: listar páginas, determinar a ordem, e montar
 * a navegação prev/next.
 *
 * A implementação real (Fase 3) usará import.meta.glob para
 * carregar todos os .md de content/ em tempo de build.
 */

export interface ContentPage {
  /** Caminho relativo em content/, ex: "ufabc/campi.md" */
  file: string
  /** Título extraído do frontmatter */
  title: string
  /** Ordem numérica global (para prev/next e sumário do PDF) */
  order: number
  /** Se true, esta página entra no PDF gerado */
  pdf: boolean
  /** URL da rota Vue */
  route: string
}

/**
 * Retorna todas as páginas de conteúdo em ordem.
 * @stub — retorna array fixo com a página de exemplo.
 */
export function listPages(): ContentPage[] {
  // TODO (Fase 3): usar import.meta.glob('./../../content/**/*.md')
  // e parsear o frontmatter de cada arquivo.
  return [
    {
      file:  'index.md',
      title: 'Apresentação',
      order: 0,
      pdf:   true,
      route: '/',
    },
  ]
}

/**
 * Retorna { prev, next } para uma página.
 */
export function getPrevNext(route: string): {
  prev: ContentPage | null
  next: ContentPage | null
} {
  const pages = listPages()
  const idx   = pages.findIndex(p => p.route === route)
  return {
    prev: idx > 0            ? pages[idx - 1] : null,
    next: idx < pages.length - 1 ? pages[idx + 1] : null,
  }
}
