# Manual do Aluno — BCC UFABC

Site estático do guia do Bacharelado em Ciência da Computação da UFABC.
Gerado a partir de arquivos Markdown, com PDF exportável via Playwright + Paged.js.

## Stack

| Camada   | Tecnologia                              |
|----------|-----------------------------------------|
| Build    | Vite 5                                  |
| Framework | Vue 3 + TypeScript (Composition API)   |
| Estilo   | Tailwind CSS v4 + `@tailwindcss/vite`   |
| Roteamento | vue-router 4                          |
| Markdown | markdown-it (Fase 3)                    |
| PDF      | Paged.js + Playwright (Fase 4)          |
| Pacotes  | pnpm 9                                  |
| Testes   | Vitest + ESLint (`@eslint/markdown`)    |
| CI       | GitHub Actions (`.github/workflows/ci.yml`) |
| Deploy   | GitHub Pages via GitHub Actions         |

## Início rápido

Requer **Node 18.12+** e **pnpm**. O projeto não usa npm: não gere `package-lock.json`.

```bash
corepack enable      # uma vez; ativa o pnpm na versão fixada em package.json
pnpm install
pnpm dev
```

Sem o Corepack, instale o pnpm direto: `npm i -g pnpm@9.15.9`.

Acesse `http://localhost:5173` (se a porta estiver ocupada, o Vite usa a próxima e avisa no terminal).
Se aparecer `504 Outdated Optimize Dep` ou rotas que não abrem depois de trocar dependências, rode `pnpm dev --force`.

## Scripts

| Comando             | O que faz                                              |
|---------------------|--------------------------------------------------------|
| `pnpm dev`          | Servidor de desenvolvimento com HMR                    |
| `pnpm build`        | TypeScript check + build de produção                   |
| `pnpm preview`      | Serve o build em `http://localhost:4173`               |
| `pnpm pdf`          | Gera `dist/guia.pdf` (ver abaixo)                      |
| `pnpm pdf:check`    | Verifica o PDF gerado (íntegro, páginas esperadas)     |
| `pnpm test`         | Testes do renderizador Markdown e do conteúdo          |
| `pnpm lint:content` | ESLint das regras de formato em `content/*.md`         |

## Geração de PDF

> Requer `playwright` e `pagedjs` (`optionalDependencies`, instalados com `pnpm install`).
> Na primeira vez, baixe o navegador: `pnpm exec playwright install chromium`.

```bash
pnpm build
pnpm preview             # deixe rodando em localhost:4173 (outro terminal)
pnpm pdf                 # gera dist/guia.pdf
pnpm pdf:check           # confere se o PDF está íntegro
```

O script `scripts/generate-pdf.ts` abre `/print` no Chromium headless,
confere que cada página com `pdf: true` foi renderizada, aguarda o sinal
`window.__PAGED_DONE__ = true` do Paged.js e salva o PDF.

## Testes e lint

```bash
pnpm lint:content   # regras de formato dos .md (frontmatter, :::, [!TIPO], links, headings)
pnpm test           # renderizador Markdown + estrutura do conteúdo
```

As regras do lint ficam em `eslint-rules/manual-plugin.js`. Ao criar um container
ou tipo de callout novo, atualize as constantes no topo desse arquivo e o `markdown.ts`.

## CI

A cada push na `main` e a cada pull request, o GitHub Actions roda `lint:content`,
`test` e `build`; depois gera e verifica o PDF (guardado como artefato `guia-pdf`).
Rode esses comandos localmente antes de enviar para evitar surpresas.

## Conteúdo

Edite os arquivos em `content/`. Cada pasta é uma seção, cada `.md` é uma página.
Veja o frontmatter de exemplo em `content/index.md`.

## Arquitetura

Veja `ARCHITECTURE.md` para as convenções de camadas, imports e estilo.
