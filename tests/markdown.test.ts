import { describe, it, expect } from 'vitest'
import { renderMarkdown, extractToc } from '../src/shared/lib/markdown'

describe('plugins customizados do renderizador', () => {
  it.each(['NOTE', 'TIP', 'WARNING', 'IMPORTANT', 'CAUTION'])('callout [!%s]', (k) => {
    const html = renderMarkdown(`> [!${k}]\n> conteúdo`)
    expect(html).toContain(`<aside data-callout="${k.toLowerCase()}">`)
    expect(html).not.toContain('[!')
    expect(html).not.toContain('<blockquote')
  })

  it('callout não duplica o texto (regressão)', () => {
    expect(renderMarkdown('> [!TIP]\n> unico').match(/unico/g)).toHaveLength(1)
  })

  it('container :::dica', () => {
    const html = renderMarkdown(':::dica\nTexto\n:::')
    expect(html).toContain('<aside data-callout="tip">')
    expect(html).not.toContain(':::')
  })

  it('cards aninhados, com escape de HTML', () => {
    const html = renderMarkdown('::::cards\n:::card CR | <b>Rendimento\nTexto\n:::\n::::')
    expect(html).toContain('class="md-cards"')
    expect(html).toContain('data-card="CR"')
    expect(html).not.toContain('<b>')
    expect(html).not.toContain(':::')
  })

  it('selos só em tabelas com coluna "Conceito"', () => {
    const com = renderMarkdown('| Conceito | S |\n|---|---|\n| A | x |')
    const sem = renderMarkdown('| X | S |\n|---|---|\n| A | x |')
    expect(com).toContain('selo selo-a')
    expect(sem).not.toContain('selo')
  })
})

describe('extractToc', () => {
  it('só h2 e h3, e slug bate com o id renderizado', () => {
    const src = '# T\n## Pré-requisitos\n### B\n#### C'
    const toc = extractToc(src)
    expect(toc.map((t) => t.level)).toEqual([2, 3])
    expect(renderMarkdown(src)).toContain(`id="${toc[0]!.slug}"`)
  })
})
