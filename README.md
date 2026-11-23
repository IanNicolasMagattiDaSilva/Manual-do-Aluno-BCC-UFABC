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
| Deploy   | GitHub Pages via GitHub Actions         |

## Início rápido

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Scripts

| Comando       | O que faz                                        |
|---------------|--------------------------------------------------|
| `npm run dev` | Servidor de desenvolvimento com HMR              |
| `npm run build` | TypeScript check + build de produção           |
| `npm run preview` | Serve o build em `http://localhost:4173`     |
| `npm run pdf` | Gera `dist/guia.pdf` (ver abaixo)                |

## Geração de PDF

> Requer `playwright` instalado (declarado como `optionalDependency`).

```bash
npm install playwright
npm run build
npm run preview &        # deixa rodando em localhost:4173
npm run pdf
```

O script `scripts/generate-pdf.ts` abre `/print` no Chromium headless,
aguarda o sinal `window.__PAGED_DONE__ = true` do Paged.js e salva o PDF.

## Conteúdo

Edite os arquivos em `content/`. Cada pasta é uma seção, cada `.md` é uma página.
Veja o frontmatter de exemplo em `content/index.md`.

## Arquitetura

Veja `ARCHITECTURE.md` para as convenções de camadas, imports e estilo.
