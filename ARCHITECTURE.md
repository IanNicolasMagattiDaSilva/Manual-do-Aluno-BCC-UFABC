# ARCHITECTURE.md — Convenções do projeto

## 1. Objetivo

Site estático do **Manual do Aluno BCC UFABC**, gerado a partir de arquivos Markdown
(`content/`), com leitura online confortável (sidebar, sumário, prev/next, busca) e
exportação de PDF vetorial via Paged.js + Playwright no CI. Sem backend, sem login.

---

## 2. Camadas e sentido de dependência

```
pages  ──► features ──► entities
  │            │              │
  └────────────┴──────────────┴──► shared
                                    (ui / lib / config / styles)
app ──► pages + router
widgets ──► shared  (widgets são composições de shared/ui sem lógica de domínio)
```

**Regra de ouro:** a seta indica "pode importar de". Nunca o contrário.

| Camada     | Pode importar de                   | Não pode importar de          |
|------------|------------------------------------|-------------------------------|
| `app/`     | `pages/`, `shared/`                | —                             |
| `pages/`   | `features/`, `widgets/`, `shared/` | `app/`                        |
| `widgets/` | `shared/`                          | `features/`, `pages/`, `app/` |
| `features/`| `entities/`, `shared/`             | outras `features/`, `pages/`  |
| `entities/`| `shared/`                          | `features/`, `pages/`         |
| `shared/`  | ninguém acima                      | tudo acima                    |

---

## 3. Regra de ouro: features não se importam entre si

Se duas features precisam de algo em comum (um tipo, um utilitário, um componente UI),
esse algo vai para `shared/` — sub-pastas `ui/`, `lib/` ou `config/`.

**Único lugar onde se compõe de várias features:** `pages/`.

Exemplo correto:
```ts
// pages/ufabc/AvaliacaoPage.vue
import { Header, Sidebar } from '@features/navigation'   // OK
import { Hero }            from '@widgets/hero'           // OK
import { useTheme }        from '@features/theme'         // OK — pages podem usar features
```

Exemplo proibido:
```ts
// features/navigation/Header.vue
import { useTheme } from '@features/theme'  // PROIBIDO — feature importando feature
// Solução: mover useTheme para @shared/lib/useTheme.ts OU receber como prop/inject
```

---

## 4. Convenção de imports

Sempre use os aliases configurados no `vite.config.ts` e `tsconfig.app.json`.

```ts
// CORRETO
import { Logo }      from '@shared/ui/Logo'
import { Header }    from '@features/navigation'
import { useTheme }  from '@features/theme'
import type { Tema } from '@shared/config/tokens'

// PROIBIDO — import relativo que atravessa camadas
import { Logo } from '../../shared/ui/Logo'       // nunca
import { Header } from '../../../features/navigation'  // nunca
```

Imports dentro da mesma feature podem ser relativos:
```ts
// features/navigation/Header.vue
import Sidebar from './Sidebar.vue'  // OK — mesma feature
```

---

## 5. Como adicionar...

### Nova página

1. Criar `src/pages/<nome>/<NomePage>.vue` usando `DocLayout.vue` como wrapper.
2. Adicionar a rota em `src/app/router.ts`.
3. Adicionar a entrada em `src/shared/config/routes.ts` (para breadcrumb e nav).
4. Criar o arquivo `.md` correspondente em `content/`.

### Nova feature

1. Criar `src/features/<nome>/` com os componentes/composables.
2. Criar `src/features/<nome>/index.ts` exportando o público.
3. Se a feature precisar de tipos compartilhados, colocá-los em `src/entities/`.
4. Se a feature precisar de utilitários cross-feature, colocá-los em `src/shared/lib/`.

### Novo primitivo UI (shared/ui)

1. Criar `src/shared/ui/<Nome>/<Nome>.vue`.
2. Criar `src/shared/ui/<Nome>/index.ts` com `export { default as Nome } from './Nome.vue'`.
3. Re-exportar em `src/shared/ui/index.ts`.
4. Se o componente precisar de lógica JS com tokens (como Logo e Wafer), importar de
   `@shared/config/tokens` — nunca hardcodar valores de cor.

---

## 6. Convenção de estilo

### Tokens no `@theme`, utilitárias no template

Todos os design tokens estão em `src/shared/styles/theme.css` dentro do bloco `@theme`.
O Tailwind v4 gera automaticamente as classes utilitárias (`bg-brand-azul`,
`text-fg-muted`, `font-display`, etc.).

**Nunca use `@apply` para criar classes semânticas.** Use as utilitárias diretamente
no template. Isso mantém o CSS trivialmente tree-shakeable e legível.

```html
<!-- CORRETO -->
<h1 class="font-display text-[64px] uppercase tracking-[0.5px] text-fg-default">

<!-- PROIBIDO -->
<style>
  .titulo { @apply font-display text-[64px] uppercase; }  /* não faça isso */
</style>
```

**Para valores sem classe pronta** (ex: `clamp`, gradiente customizado), use
a sintaxe de valor arbitrário do Tailwind:
```html
<h1 class="[font-size:clamp(48px,8vw,96px)]">
```

### Novo token

Adicionar em `src/shared/styles/theme.css` dentro do bloco `@theme`, com comentário
explicando o uso e por que o token existente não serve. Espelhar em
`src/shared/config/tokens.ts` para uso em lógica JS.

---

## 7. Convenção de PDF

- A rota `/print` usa `PrintLayout.vue` com `print.css` importado nele.
- `print.css` define `@page`, quebras de página, cabeçalho/rodapé com `string-set`.
- `window.__PAGED_DONE__ = true` sinaliza ao Playwright que a paginação terminou.
- Páginas de PDF ficam em `src/pages/print/` (criadas na Fase 4).
- Para esconder elementos no PDF: use a classe `no-print`.
- Nunca importar `print.css` fora do `PrintLayout.vue`.

---

## 8. Tokens definidos

### Cores

| Token CSS                     | Valor     | Uso principal                                      |
|-------------------------------|-----------|----------------------------------------------------|
| `--color-brand-azul`          | `#008BBB` | Azul principal; fundo de header hero, destaque     |
| `--color-brand-azul-escuro`   | `#006E95` | Hover de links; borda de callout info              |
| `--color-brand-azul-claro`    | `#3FB8E5` | Accent; chips de fatos na home                     |
| `--color-brand-amarelo`       | `#FFCC00` | Variante hero amarela; chips; badge D              |
| `--color-brand-verde`         | `#006633` | Parte 1 UFABC; badge A/B/C aprovado                |
| `--color-fg-default`          | `#0E1726` | Texto principal; títulos na variante amarela       |
| `--color-fg-strong`           | `#2D3748` | Lead paragraphs; corpo secundário                  |
| `--color-fg-muted`            | `#4A5568` | Meta, breadcrumb, placeholder                      |
| `--color-fg-on-azul`          | `#04222F` | Texto sobre fundo azul (variante azul)             |
| `--color-fg-on-dark-muted`    | `#D5DCE3` | Texto muted sobre fundo escuro `#0E1726`           |
| `--color-bg-default`          | `#FFFFFF` | Fundo padrão da página                             |
| `--color-bg-azul-soft`        | `#E6F4F9` | Fundo de item ativo na sidebar; callout info       |
| `--color-bg-surface`          | `#F3F5F7` | Footer; cards neutros                              |
| `--color-border-subtle`       | `#E2E6EA` | Divisores; borda padrão de inputs                  |
| `--color-border-strong`       | `#CBD2D9` | Borda de inputs; separador do header               |
| `--color-status-erro`         | `#B3261E` | Badge F/O reprovado                                |

### Tipografia

| Token CSS          | Valor                            | Uso                                          |
|--------------------|----------------------------------|----------------------------------------------|
| `--font-display`   | `'Anton', sans-serif`            | Títulos grandes, uppercase, tracking amplo   |
| `--font-sans`      | `'Inter', system-ui, sans-serif` | Corpo, line-height 1.6–1.7                   |
| `--font-mono`      | `'JetBrains Mono', monospace`    | Chips, eyebrows, labels, tracking 2–5px      |

### Layout

| Token CSS                | Valor    | Uso                           |
|--------------------------|----------|-------------------------------|
| `--width-content-home`   | `1200px` | max-width da home             |
| `--width-content-doc`    | `1360px` | max-width das páginas de doc  |

---

## Decisões de projeto documentadas

**D1 — Sem `@apply` em classes semânticas.**
Optamos por utilitárias no template porque facilita o tree-shaking, elimina a necessidade
de um arquivo CSS por componente e torna o componente autocontido.

**D2 — `RouterLink` em vez de `<a>` em toda navegação interna.**
Necessário para o roteamento SPA funcionar corretamente com o histórico do browser.

**D3 — `features/theme` como composable singleton (ref fora do setup).**
O tema é estado global. Um `ref` fora da função de composable é o padrão Vue 3 para
estado compartilhado sem Pinia, adequado para a simplicidade deste projeto.

**D4 — `tsx` como runner do script de PDF.**
Evita configurar um tsconfig separado para scripts. `tsx` executa TypeScript direto
sem build prévio, o que é suficiente para o script de CI.

**D5 — `Header.vue` usa slot `#actions` em vez de importar features.**
O Header pertence a `features/navigation` e não pode importar `features/search` ou
`features/pdf-export`. A solução: slot `#actions` que o layout pai (pages) preenche
com `SearchInput` + `DownloadPdfButton`. Assim a composição acontece em `pages/`,
que é o único lugar onde múltiplas features podem se encontrar.
