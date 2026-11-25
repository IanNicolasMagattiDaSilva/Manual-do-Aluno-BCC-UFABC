/**
 * generate-pdf.ts — Script de geração do PDF via Playwright + Paged.js.
 * Executado no CI após `pnpm build && pnpm preview`.
 *
 * Requer:
 *   - playwright instalado (optionalDependency)
 *   - vite preview rodando em http://localhost:4173
 *
 * Uso:
 *   pnpm pdf
 *   (ou: tsx scripts/generate-pdf.ts)
 *
 * O PrintLayout.vue sinaliza window.__PAGED_DONE__ = true
 * quando o Paged.js terminar a paginação.
 */

// Ref: plano-site-guia-curso.md §4

import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { chromium } from 'playwright'
import { expectedPdfPages } from './pdf-shared'

const PREVIEW_URL = process.env['PREVIEW_URL'] ?? 'http://localhost:4173'
const OUTPUT_PATH = process.env['PDF_OUTPUT']   ?? 'dist/guia.pdf'

/*
 * Também espelhamos o PDF em public/guia.pdf para que `pnpm dev` sirva o
 * arquivo em http://localhost:5173/guia.pdf sem depender do pipeline de build.
 * O `vite build` copia public/* para dist/*, então o arquivo em public/ também
 * garante que builds locais sem rodar `pnpm pdf` ainda tenham um PDF válido.
 */
const PUBLIC_COPY = 'public/guia.pdf'

async function main() {
  console.log(`[pdf] Abrindo ${PREVIEW_URL}/print ...`)

  const browser = await chromium.launch()
  const page    = await browser.newPage()

  const pageErrors: string[] = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  page.on('console',   (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })

  await page.goto(`${PREVIEW_URL}/print`, { waitUntil: 'networkidle' })

  console.log('[pdf] Aguardando Paged.js ...')
  await page.waitForFunction(
    () => (window as unknown as { __PAGED_DONE__?: boolean }).__PAGED_DONE__ === true,
    { timeout: 60_000 },
  )

  // Cada página com pdf: true precisa ter sido renderizada em /print.
  const missing: string[] = []
  for (const p of expectedPdfPages()) {
    const found = await page.evaluate((id) => !!document.getElementById(id), p.anchor)
    if (!found) missing.push(`${p.file} (#${p.anchor})`)
  }
  if (missing.length)    throw new Error('Páginas ausentes em /print: ' + missing.join(', '))
  if (pageErrors.length) throw new Error('Erros no navegador:\n  ' + pageErrors.join('\n  '))

  console.log(`[pdf] Gerando PDF → ${OUTPUT_PATH}`)
  const outDir = dirname(OUTPUT_PATH)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  await page.pdf({
    path:              OUTPUT_PATH,
    preferCSSPageSize: true,
    printBackground:   true,
  })

  // Espelha em public/guia.pdf para `pnpm dev` servir o mesmo arquivo.
  if (OUTPUT_PATH !== PUBLIC_COPY) {
    const pubDir = dirname(PUBLIC_COPY)
    if (!existsSync(pubDir)) mkdirSync(pubDir, { recursive: true })
    copyFileSync(OUTPUT_PATH, PUBLIC_COPY)
    console.log(`[pdf] Espelhado em ${PUBLIC_COPY}`)
  }

  await browser.close()
  console.log('[pdf] Pronto.')
}

main().catch((err) => {
  console.error('[pdf] Erro:', err)
  process.exit(1)
})
