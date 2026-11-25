import { describe, it, expect } from 'vitest'
import { listPages } from '../src/shared/lib/content'
import { renderMarkdown } from '../src/shared/lib/markdown'

const pages = listPages()
const routes = new Set(pages.map((p) => p.route))

it('rotas são únicas', () => {
  expect(routes.size).toBe(pages.length)
})

describe.each(pages.map((p) => [p.file, p] as const))('%s', (_file, page) => {
  const html = renderMarkdown(page.body)

  it('frontmatter válido (title, order, route)', () => {
    expect(page.title).not.toBe(page.file)
    expect(page.order).not.toBe(999)
    expect(page.route).toMatch(/^\/[a-z0-9\-/]*$/)
  })

  it('sem sintaxe não processada (:::, [!TIPO])', () => {
    expect(html).not.toMatch(/^\s*(<p>)?\s*:{3,}/m)
    expect(html).not.toMatch(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i)
  })

  it('aside, div e table balanceados', () => {
    const n = (re: RegExp) => (html.match(re) ?? []).length
    expect(n(/<aside/g)).toBe(n(/<\/aside>/g))
    expect(n(/<div/g)).toBe(n(/<\/div>/g))
    expect(n(/<table/g)).toBe(n(/<\/table>/g))
  })

  it('links internos apontam para rotas existentes', () => {
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]!)
    for (const h of hrefs) {
      expect(routes.has(h.length > 1 ? h.replace(/\/$/, '') : h), `link quebrado: ${h}`).toBe(true)
    }
  })
})
