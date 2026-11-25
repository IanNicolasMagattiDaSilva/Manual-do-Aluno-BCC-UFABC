/**
 * Plugin ESLint local — regras para a sintaxe própria do Manual do Aluno.
 * Espelha o que src/shared/lib/markdown.ts e content.ts entendem; se um dos
 * dois mudar (novo container, novo callout), atualize as constantes abaixo.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'content')
const CONTAINERS  = { dica: false, cards: false, card: true } // nome → exige argumento
const CALLOUTS    = ['NOTE', 'TIP', 'WARNING', 'IMPORTANT', 'CAUTION']

/* ---------- utilidades ---------- */

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const data = {}
  m[1].split(/\r?\n/).forEach((line, i) => {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/)
    if (!kv) return
    const val = kv[2].trim().replace(/^["']|["']$/g, '')
    data[kv[1]] = { raw: val, line: i + 2 }
  })
  return data
}

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
  })
}

/** route de cada arquivo em content/ (mesma lógica de content.ts). */
function loadRoutes() {
  const byRoute = new Map()
  try {
    for (const file of walk(CONTENT_DIR)) {
      const rel = relative(CONTENT_DIR, file).split(sep).join('/')
      const fm = parseFrontmatter(readFileSync(file, 'utf8'))
      const route = fm?.route?.raw ?? (rel === 'index.md' ? '/' : '/' + rel.replace(/\.md$/, ''))
      byRoute.set(route, [...(byRoute.get(route) ?? []), rel])
    }
  } catch { /* sem content/ — regras de link ficam inertes */ }
  return byRoute
}
const ROUTES = loadRoutes()

/** Linhas fora de blocos de código cercados. */
function proseLines(text) {
  const out = []
  let fence = null
  text.split(/\r?\n/).forEach((line, i) => {
    const f = line.match(/^\s*(`{3,}|~{3,})/)
    if (f) {
      if (!fence) fence = f[1][0]
      else if (f[1][0] === fence) fence = null
      return
    }
    if (!fence) out.push({ line, n: i + 1 })
  })
  return out
}

const at = (n, col = 1) => ({ start: { line: n, column: col }, end: { line: n, column: col + 1 } })

/* ---------- regras ---------- */

const frontmatter = {
  meta: { type: 'problem', docs: { description: 'Frontmatter obrigatório e válido' }, schema: [] },
  create(context) {
    return {
      root() {
        const fm = parseFrontmatter(context.sourceCode.text)
        if (!fm) return context.report({ loc: at(1), message: 'Frontmatter ausente (--- title/order/route ---).' })
        for (const key of ['title', 'order', 'route']) {
          if (!fm[key] || fm[key].raw === '') context.report({ loc: at(1), message: `Frontmatter sem "${key}".` })
        }
        if (fm.order && !/^-?\d+(\.\d+)?$/.test(fm.order.raw))
          context.report({ loc: at(fm.order.line), message: `"order" deve ser numérico (recebido "${fm.order.raw}").` })
        if (fm.route) {
          if (!/^\/[a-z0-9\-/]*$/.test(fm.route.raw))
            context.report({ loc: at(fm.route.line), message: `"route" inválida: "${fm.route.raw}" (use /minusculas-e-hifens).` })
          const dups = ROUTES.get(fm.route.raw) ?? []
          if (dups.length > 1)
            context.report({ loc: at(fm.route.line), message: `Rota "${fm.route.raw}" duplicada em: ${dups.join(', ')}.` })
        }
        if (fm.pdf && !/^(true|false)$/.test(fm.pdf.raw))
          context.report({ loc: at(fm.pdf.line), message: '"pdf" deve ser true ou false.' })
      },
    }
  },
}

const containers = {
  meta: { type: 'problem', docs: { description: 'Containers ::: balanceados e conhecidos' }, schema: [] },
  create(context) {
    return {
      root() {
        const stack = [] // { fence, name, n }
        for (const { line, n } of proseLines(context.sourceCode.text)) {
          const m = line.match(/^\s*(:{3,})\s*(\S*)\s*(.*?)\s*$/)
          if (!m) continue
          const [, colons, name, args] = m
          const fence = colons.length
          if (name === '') { // fechamento
            const top = stack[stack.length - 1]
            if (!top) { context.report({ loc: at(n), message: 'Fechamento ":::" sem container aberto.' }); continue }
            if (fence < top.fence)
              context.report({ loc: at(n), message: `Fecha com ${fence} ":" mas "${top.name}" (linha ${top.n}) abriu com ${top.fence}; o container não fecha.` })
            stack.pop()
            continue
          }
          if (!(name in CONTAINERS)) {
            context.report({ loc: at(n), message: `Container desconhecido ":::${name}". Válidos: ${Object.keys(CONTAINERS).join(', ')}.` })
            continue
          }
          if (CONTAINERS[name] && !args)
            context.report({ loc: at(n), message: `":::${name}" exige argumento (ex.: ":::${name} CR | Descrição").` })
          const parent = stack[stack.length - 1]
          if (parent && fence >= parent.fence)
            context.report({ loc: at(n), message: `Container aninhado precisa de menos ":" que o externo (${parent.fence}); use mais ":" no externo.` })
          stack.push({ fence, name, n })
        }
        for (const s of stack) context.report({ loc: at(s.n), message: `Container ":::${s.name}" nunca é fechado.` })
      },
    }
  },
}

const callouts = {
  meta: { type: 'problem', docs: { description: 'Callouts GFM válidos' }, schema: [] },
  create(context) {
    return {
      root() {
        for (const { line, n } of proseLines(context.sourceCode.text)) {
          const m = line.match(/^\s*>\s*\[!([^\]]*)\]/)
          if (m && !CALLOUTS.includes(m[1]))
            context.report({ loc: at(n), message: `Callout "[!${m[1]}]" inválido. Use: ${CALLOUTS.map((c) => `[!${c}]`).join(', ')} (maiúsculas).` })
        }
      },
    }
  },
}

const internalLinks = {
  meta: { type: 'problem', docs: { description: 'Links internos apontam para rotas existentes' }, schema: [] },
  create(context) {
    return {
      root() {
        if (ROUTES.size === 0) return
        for (const { line, n } of proseLines(context.sourceCode.text)) {
          for (const m of line.matchAll(/\]\((\/[^)\s#?]*)/g)) {
            const href = m[1]
            if (/\.[a-z0-9]+$/i.test(href)) continue // arquivos estáticos
            const clean = href.length > 1 ? href.replace(/\/$/, '') : href
            if (!ROUTES.has(clean))
              context.report({ loc: at(n, m.index + 1), message: `Link interno "${href}" não corresponde a nenhuma página.` })
          }
        }
      },
    }
  },
}

const headingStructure = {
  meta: { type: 'problem', docs: { description: 'Um único h1 e sem pular níveis' }, schema: [] },
  create(context) {
    let h1 = 0
    let last = 0
    return {
      heading(node) {
        const d = node.depth
        if (d === 1 && ++h1 > 1) context.report({ node, message: 'Mais de um título h1 na página.' })
        if (last && d > last + 1) context.report({ node, message: `Heading pula de h${last} para h${d}.` })
        last = d
      },
      'root:exit'() {
        if (h1 === 0) context.report({ loc: at(1), message: 'Página sem título h1.' })
      },
    }
  },
}

export default {
  meta: { name: 'eslint-plugin-manual' },
  rules: {
    frontmatter,
    containers,
    callouts,
    'internal-links': internalLinks,
    'heading-structure': headingStructure,
  },
}
