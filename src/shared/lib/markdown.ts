/**
 * markdown.ts — Stub do renderizador Markdown.
 * A implementação real com markdown-it, plugins de callout,
 * âncoras de cabeçalho e Shiki será adicionada na Fase 3.
 *
 * Uso futuro:
 *   import { renderMarkdown } from '@shared/lib/markdown'
 *   const html = await renderMarkdown(rawString)
 */

/**
 * Renderiza uma string Markdown para HTML.
 * @stub — retorna o texto envolto em <p> até a Fase 3.
 */
export async function renderMarkdown(source: string): Promise<string> {
  // TODO (Fase 3): instanciar markdown-it com plugins:
  //   - markdown-it-anchor (cabeçalhos com id)
  //   - markdown-it-attrs
  //   - callout plugin ([!TIP], [!NOTE], etc.)
  //   - shiki para syntax highlight
  //   - KaTeX se necessário
  return `<p>${source.replace(/\n/g, '<br>')}</p>`
}
