/**
 * content.ts — Loader das páginas de conteúdo (content/**​/*.md).
 *
 * Usa import.meta.glob (eager) do Vite para incluir todos os .md no bundle
 * em tempo de build — sem fetch em runtime, sem backend.
 *
 * Cada .md deve ter frontmatter YAML-ish com, no mínimo, `title`, `order`
 * e `route`. `pdf: true` inclui a página no PDF gerado.
 */

export interface ContentPage {
  /** Caminho relativo em content/, ex: "ufabc/campi.md" */
  file:        string
  /** Título extraído do frontmatter */
  title:       string
  /** Ordem numérica global (para prev/next e sumário do PDF) */
  order:       number
  /** Se true, esta página entra no PDF gerado */
  pdf:         boolean
  /** URL da rota Vue */
  route:       string
  /** Descrição curta (meta/preview) — opcional */
  description: string
  /** Seção lógica (ufabc, bct, bcc...) — derivada da pasta */
  section:     string
  /** Corpo Markdown (já sem o frontmatter) */
  body:        string
}

type RawModule = string

/*
 * import.meta.glob com `?raw` + eager carrega o texto bruto de cada .md
 * em tempo de build, sem bundling ao estilo módulo ESM.
 * O prefixo `/content/` é absoluto a partir da raiz do projeto Vite.
 */
const rawFiles = import.meta.glob('/content/**/*.md', {
  query:  '?raw',
  import: 'default',
  eager:  true,
}) as Record<string, RawModule>

/**
 * Parser minimalista de frontmatter YAML (apenas pares chave: valor em linhas).
 * Suporta valores string, number, boolean. Sem listas nem objetos aninhados —
 * se o conteúdo precisar disso, promover para gray-matter.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const [, header, body] = match
  const data: Record<string, unknown> = {}

  for (const line of header!.split('\n')) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    const val = (rawVal ?? '').trim().replace(/^["']|["']$/g, '')
    if (val === 'true')        data[key!] = true
    else if (val === 'false')  data[key!] = false
    else if (/^-?\d+(\.\d+)?$/.test(val)) data[key!] = Number(val)
    else                       data[key!] = val
  }

  return { data, body: body ?? '' }
}

/** Deriva a rota a partir do caminho do arquivo. index.md vira `/`, o resto perde o `.md`. */
function routeFromFile(file: string): string {
  if (file === 'index.md') return '/'
  return '/' + file.replace(/\.md$/, '')
}

/** Primeira pasta do caminho, ou 'home' se o arquivo estiver na raiz. */
function sectionFromFile(file: string): string {
  const [first] = file.split('/')
  return first && first.endsWith('.md') ? 'home' : (first ?? 'home')
}

const pages: ContentPage[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const file = path.replace(/^\/content\//, '')
    const { data, body } = parseFrontmatter(raw)
    return {
      file,
      title:       String(data['title']       ?? file),
      order:       Number(data['order']       ?? 999),
      pdf:         Boolean(data['pdf']        ?? false),
      route:       String(data['route']       ?? routeFromFile(file)),
      description: String(data['description'] ?? ''),
      section:     String(data['section']     ?? sectionFromFile(file)),
      body,
    } satisfies ContentPage
  })
  .sort((a, b) => a.order - b.order)

/**
 * Retorna todas as páginas de conteúdo em ordem.
 */
export function listPages(): ContentPage[] {
  return pages
}

/**
 * Retorna apenas as páginas marcadas para inclusão no PDF.
 */
export function listPdfPages(): ContentPage[] {
  return pages.filter((p) => p.pdf)
}

/** Busca uma página pelo route (`/ufabc/campi`, `/`, etc.). */
export function getPageByRoute(route: string): ContentPage | null {
  return pages.find((p) => p.route === route) ?? null
}

/**
 * Retorna { prev, next } para uma página, respeitando a ordem global.
 */
export function getPrevNext(route: string): {
  prev: ContentPage | null
  next: ContentPage | null
} {
  const idx = pages.findIndex((p) => p.route === route)
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0                 ? pages[idx - 1]! : null,
    next: idx < pages.length - 1  ? pages[idx + 1]! : null,
  }
}

/**
 * Âncora (id) de uma página dentro do PDF — usada pelo sumário
 * (PdfSumario) e pelo <article> de cada página (PdfMarkdownPages).
 */
export function pdfAnchor(route: string): string {
  return 'pdf' + (route === '/' ? '-inicio' : route.replace(/\//g, '-'))
}
