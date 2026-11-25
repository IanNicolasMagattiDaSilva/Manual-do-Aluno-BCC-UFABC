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

import { chromium } from 'playwright'
import { expectedPdfPages } from './pdf-shared'

const PREVIEW_URL = process.env['PREVIEW_URL'] ?? 'http://localhost:4173'
const OUTPUT_PATH = process.env['PDF_OUTPUT']   ?? 'dist/guia.pdf'

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
  await page.pdf({
    path:              OUTPUT_PATH,
    preferCSSPageSize: true,
    printBackground:   true,
  })

  await browser.close()
  console.log('[pdf] Pronto.')
}

main().catch((err) => {
  console.error('[pdf] Erro:', err)
  process.exit(1)
})
