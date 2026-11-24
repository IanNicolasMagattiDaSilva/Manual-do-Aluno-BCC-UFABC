/**
 * markdown.ts — Renderizador Markdown do Manual do Aluno.
 *
 * Responsabilidades:
 *   1. renderMarkdown(src) → HTML (markdown-it + anchor + attrs + callouts GFM)
 *   2. extractToc(src)    → árvore de headings para a TOC lateral
 *
 * Callouts GFM reconhecidos (sintaxe `[!TIPO]` no primeiro parágrafo de uma
 * blockquote) viram `<aside data-callout="tipo">`, consumido tanto pelo CSS
 * da leitura online quanto pelo print.css (break-inside: avoid).
 */

import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
// markdown-it-attrs v5 ships tipos vinculados a uma versão antiga de
// @types/markdown-it (lib/*). Com @types/markdown-it 14 (dist/*.cjs) o
// TS reclama de incompatibilidade estrutural entre MarkdownIt. O cast
// mantém o uso correto do plugin em runtime sem poluir o call-site.
import attrsRaw from 'markdown-it-attrs'
type AttrsPlugin = (md: MarkdownIt, opts?: { leftDelimiter?: string; rightDelimiter?: string }) => void
const attrs = attrsRaw as unknown as AttrsPlugin

export interface TocEntry {
  /** Nível do heading: 2 ou 3 (h1 é o título da página, não entra na TOC). */
  level: 2 | 3
  /** Texto visível do heading. */
  text:  string
  /** id gerado por markdown-it-anchor — usado como `#slug`. */
  slug:  string
}

const CALLOUT_KINDS = ['note', 'tip', 'warning', 'important', 'caution'] as const
type CalloutKind = (typeof CALLOUT_KINDS)[number]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const md = new MarkdownIt({
  html:        true,
  linkify:     true,
  typographer: true,
})
  .use(anchor, {
    slugify,
    permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
  })
  .use(attrs, {
    leftDelimiter:  '{',
    rightDelimiter: '}',
  })

/*
 * Plugin de callouts GFM. Transforma:
 *   > [!TIP]
 *   > texto
 * em:
 *   <aside data-callout="tip"> <p>texto</p> </aside>
 *
 * Implementado como pós-processo da regra blockquote_open/close: sabemos que
 * o primeiro `inline` dentro da blockquote é o parágrafo com a sintaxe `[!X]`.
 */
md.core.ruler.after('block', 'gfm-callouts', (state) => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    const open = tokens[i]
    if (!open || open.type !== 'blockquote_open') continue

    // Formato esperado: blockquote_open, paragraph_open, inline, paragraph_close, ...
    const paraOpen  = tokens[i + 1]
    const inline    = tokens[i + 2]
    const paraClose = tokens[i + 3]
    if (!paraOpen || paraOpen.type !== 'paragraph_open') continue
    if (!inline   || inline.type   !== 'inline')         continue
    if (!paraClose|| paraClose.type!== 'paragraph_close')continue

    const match = inline.content.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*\n?([\s\S]*)$/)
    if (!match) continue

    const kind = match[1]!.toLowerCase() as CalloutKind
    const rest = match[2] ?? ''

    // Troca `blockquote_open` por aside com atributo data-callout.
    open.type       = 'html_block'
    open.tag        = ''
    open.block      = true
    open.content    = `<aside data-callout="${kind}">\n`
    open.markup     = ''
    open.hidden     = false

    // Fecha blockquote → fechamento do aside.
    // Encontrar o blockquote_close correspondente (balanceando níveis).
    let depth = 1
    for (let j = i + 1; j < tokens.length; j++) {
      const t = tokens[j]
      if (!t) continue
      if (t.type === 'blockquote_open')  depth++
      if (t.type === 'blockquote_close') {
        depth--
        if (depth === 0) {
          t.type    = 'html_block'
          t.tag     = ''
          t.content = '</aside>\n'
          t.markup  = ''
          break
        }
      }
    }

    // Reescreve o conteúdo do parágrafo: remove a linha `[!X]`.
    if (rest.trim() === '') {
      // Remove o parágrafo vazio (open/inline/close).
      tokens.splice(i + 1, 3)
    } else {
      inline.content = rest
      // Reparse inline para reconstruir children.
      const env = {}
      inline.children = md.parseInline(rest, env)[0]?.children ?? []
    }
  }
  return false
})

/**
 * Renderiza uma string Markdown para HTML.
 */
export function renderMarkdown(source: string): string {
  return md.render(source)
}

/**
 * Extrai a árvore de TOC (h2 e h3) de uma string Markdown.
 * Ignora h1 (título da página) e headings mais profundos.
 */
export function extractToc(source: string): TocEntry[] {
  const env    = {}
  const tokens = md.parse(source, env)
  const toc: TocEntry[] = []

  for (let i = 0; i < tokens.length; i++) {
    const open = tokens[i]
    if (!open || open.type !== 'heading_open') continue
    const level = Number(open.tag.slice(1))
    if (level !== 2 && level !== 3) continue

    const inline = tokens[i + 1]
    const text   = inline?.content.trim() ?? ''
    const slug   = open.attrGet('id') ?? slugify(text)

    toc.push({ level: level as 2 | 3, text, slug })
  }

  return toc
}
