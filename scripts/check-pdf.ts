/**
 * check-pdf.ts — verifica o PDF gerado (dist/guia.pdf).
 * Uso: pnpm pdf:check   (depois de pnpm pdf)
 *
 * Confere: arquivo existe, é um PDF íntegro (cabeçalho %PDF e %%EOF),
 * tem tamanho plausível e ao menos uma página por página `pdf: true`
 * (capa e sumário contam como extras).
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { expectedPdfPages } from './pdf-shared'

const OUTPUT_PATH = process.env['PDF_OUTPUT'] ?? 'dist/guia.pdf'
const MIN_BYTES   = 20_000

const errors: string[] = []
const fail = (m: string) => errors.push(m)

if (!existsSync(OUTPUT_PATH)) {
  console.error(`[pdf:check] ${OUTPUT_PATH} não existe. Rode "pnpm pdf" antes.`)
  process.exit(1)
}

const buf  = readFileSync(OUTPUT_PATH)
const size = statSync(OUTPUT_PATH).size
const text = buf.toString('latin1')

if (!text.startsWith('%PDF-'))            fail('Cabeçalho %PDF- ausente: arquivo não é um PDF.')
if (!text.trimEnd().endsWith('%%EOF'))    fail('Marcador %%EOF ausente: PDF truncado.')
if (size < MIN_BYTES)                     fail(`PDF muito pequeno (${size} bytes < ${MIN_BYTES}).`)

const pages    = (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length
const expected = expectedPdfPages().length
if (expected === 0)       fail('Nenhuma página com "pdf: true" em content/.')
if (pages < expected)     fail(`PDF tem ${pages} páginas, mas há ${expected} páginas de conteúdo com pdf: true.`)

console.log(`[pdf:check] ${OUTPUT_PATH}: ${(size / 1024).toFixed(0)} KB, ${pages} páginas (esperado ≥ ${expected}).`)

if (errors.length) {
  for (const e of errors) console.error(`[pdf:check] ✗ ${e}`)
  process.exit(1)
}
console.log('[pdf:check] ✓ OK')
