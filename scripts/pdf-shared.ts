/**
 * pdf-shared.ts — utilidades comuns aos scripts de PDF.
 * Lê content/**\/*.md direto do disco (content.ts usa import.meta.glob,
 * que só existe dentro do Vite).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export interface PdfPage { file: string; route: string; anchor: string }

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
  })
}

/** Mesma regra de pdfAnchor() em src/shared/lib/content.ts. */
export function pdfAnchor(route: string): string {
  return 'pdf' + (route === '/' ? '-inicio' : route.replace(/\//g, '-'))
}

/** Páginas com `pdf: true` no frontmatter. */
export function expectedPdfPages(contentDir = 'content'): PdfPage[] {
  const out: PdfPage[] = []
  for (const file of walk(contentDir)) {
    const raw = readFileSync(file, 'utf8')
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    if (!/^pdf\s*:\s*true\s*$/m.test(fm)) continue
    const route = fm.match(/^route\s*:\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, '') ?? ''
    // A home (/) não vira artigo no PDF: PdfMarkdownPages a pula (capa + sumário a substituem).
    if (route === '/') continue
    out.push({ file, route, anchor: pdfAnchor(route) })
  }
  return out
}
