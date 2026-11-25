# Guia do projeto

Documentação do repositório `manual-do-aluno-bcc-ufabc`. Escrita para quem vai manter o conteúdo, mesmo sem experiência com programação.

## 1. O que é o projeto

O Manual do Aluno BCC-UFABC é um guia para estudantes do Bacharelado em Ciência da Computação da UFABC. Reúne informações sobre a universidade (campi, matrícula, avaliação, projetos), sobre o Bacharelado em Ciência e Tecnologia (BC&T) e sobre o próprio BCC (grade, PPCs).

O mesmo material sai em dois formatos: um **site** para leitura online e um **PDF** para leitura offline ou impressão. O PDF é montado a partir de uma rota especial do site (`/print`), que é aberta por um navegador automatizado e salva como arquivo.

Os textos ficam em arquivos Markdown na pasta `content/`. O site é feito com Vue 3 e Vite, o estilo com Tailwind CSS, e o PDF com Paged.js e Playwright.

## 2. Organização de pastas

```
content/                    Textos do manual, em Markdown (a fonte do conteúdo)
  index.md                  Apresentação
  ufabc/                    Parte 1: campi, matricula, avaliacao, projetos
  bct/                      Parte 2: sobre, matriz, extensao
  bcc/                      Parte 3: sobre, grade, ppc
src/
  app/                      Inicialização: main.ts, router.ts (rotas do site), App.vue
  pages/                    Uma página Vue por tela do site
    content/                MarkdownPage.vue: página genérica que renderiza qualquer .md (BC&T e BCC)
    ufabc/ home/            Páginas .vue com texto próprio (UFABC e início)
    _layouts/               DocLayout (site) e PrintLayout (PDF)
    print/                  Páginas do PDF (ver seção 3)
  features/                 Navegação (Sidebar, PrevNext), busca, tema, botão de PDF
  shared/
    lib/content.ts          Lê os .md e interpreta o cabeçalho (frontmatter) de cada um
    lib/markdown.ts         Converte Markdown em HTML
    styles/                 main.css (site), print.css (PDF), theme.css (cores)
    config/                 Cores/temas (tokens.ts) e lista de rotas (routes.ts)
    ui/                     Componentes pequenos (Logo, Wafer)
scripts/generate-pdf.ts     Gera o arquivo PDF
examples/mockups/           Protótipos de design originais (.dc.html), só referência
public/                     Arquivos estáticos servidos como estão
dist/                       Resultado do build (gerado, não editar)
```

`src/pages/bcc/` e `src/pages/bct/` não existem mais. Ignore `node_modules/`, `pdf_diag/` (imagens de diagnóstico do PDF) e os arquivos de configuração na raiz, salvo se for mexer na parte técnica.

## 3. Arquitetura e fluxo de dados

Há dois caminhos. Para BC&T e BCC eles partem da mesma fonte (o `.md`). Só a **UFABC** ainda tem o texto do site escrito em componentes Vue, separado do `.md` do PDF.

### a) Caminho do site

1. O navegador abre uma rota (ex.: `/ufabc/campi`), definida em `src/app/router.ts`.
2. **BC&T e BCC** (`/bct/*`, `/bcc/*`): as rotas são geradas pelo helper `mdRoutes()` em `router.ts` e apontam todas para `src/pages/content/MarkdownPage.vue`. Ele acha o `.md` cujo `route` é igual ao endereço, converte com `renderMarkdown()` e mostra dentro do `DocLayout.vue`. Editar o `.md` altera site e PDF.
3. **UFABC** (`/ufabc/*`): a rota carrega um `.vue` de `src/pages/ufabc/` (ex.: `CampiPage.vue`), com o **texto escrito no próprio componente**, em HTML com classes Tailwind. É a única parte ainda assim.
4. O rodapé "anterior / próximo" vem de `getPrevNext()` em `content.ts`, que usa o campo `order` dos `.md`.

### b) Caminho do PDF

1. O script `scripts/generate-pdf.ts` abre `/print` no navegador (Playwright) e espera o Paged.js terminar a paginação.
2. `/print` renderiza `PrintPage.vue`, que dentro do `PrintLayout.vue` empilha, nesta ordem: `PdfCapa`, `PdfSumario`, `PdfMarkdownPages`, `PdfGrade`. O resultado é A4 retrato (51 páginas na última geração).
3. `PdfMarkdownPages.vue` é o elo com o conteúdo. Ele pede a `content.ts` as páginas com `pdf: true`, agrupa por seção (`ufabc`, `bct`, `bcc`) e converte o texto de cada uma em HTML com `renderMarkdown()`. O primeiro parágrafo vira o "lead" (resumo em destaque) e o `# título` é removido, porque o título é montado pelo componente.
4. Antes de cada grupo, `PdfMarkdownPages` insere `PdfParte.vue`, a página de abertura da parte (número grande, título, lista de capítulos tirada de `content.ts`).
5. `PdfGrade.vue` (grade curricular, A4 retrato) tem **dados escritos no próprio componente**, não vêm do Markdown, e hoje são **ilustrativos** (disciplinas e códigos inventados): precisam ser trocados pelos reais. `PdfTabela.vue` existe, mas não é usado: a comparação entre PPCs vem de `content/bcc/ppc.md`.
6. `PdfSumario.vue` é o índice, **gerado dos `.md`** com `pdf: true` (mesma ordem e agrupamento de `PdfMarkdownPages`). Só as partes são fixas: a constante `PARTES` e a lista `['ufabc', 'bct', 'bcc']`. O número de página é preenchido pelo Paged.js via CSS.
7. `print.css` define o formato físico das páginas (tamanho, margens, cabeçalho, rodapé, numeração, quebras).

### Papel de cada peça

| Arquivo | Função |
|---|---|
| `shared/lib/content.ts` | Carrega todos os `.md` de `content/`, separa o frontmatter do texto e oferece listas ordenadas (todas as páginas, só as do PDF, anterior/próximo). |
| `shared/lib/markdown.ts` | Converte Markdown em HTML (`renderMarkdown`), gera ids para os títulos, reconhece avisos (`> [!TIP]`), contêineres `:::` (dica, cartões), selos de conceito em tabelas e extrai o índice de títulos (`extractToc`). |
| `print/PdfMarkdownPages.vue` | Transforma cada `.md` com `pdf: true` em página do PDF e estiliza o HTML resultante. |
| `print/PdfParte.vue` | Abertura de cada parte (UFABC, BC&T, BCC). |
| `print/PdfSumario.vue` | Índice com números de página. |
| `print/PdfGrade.vue` | Grade curricular em A4 retrato (dados ilustrativos). |
| `content/MarkdownPage.vue` | Página web genérica para qualquer `.md` (BC&T e BCC). |
| `shared/styles/print.css` | Regras de impressão: `@page`, cabeçalho/rodapé correntes, quebras, números do sumário. Só é carregado por `PrintLayout.vue`. |

## 4. Como atualizar conteúdo

Exemplo: "quero mudar o texto da aba Campi".

Em BC&T e BCC basta editar o `.md` (site e PDF mudam juntos). A UFABC ainda tem **dois lugares**, porque site e PDF têm fontes separadas:

| Para mudar... | Edite |
|---|---|
| O PDF | `content/ufabc/campi.md` |
| O site | `src/pages/ufabc/CampiPage.vue` (texto dentro do `<template>`) |

Para manter os dois iguais, altere ambos.

Passo a passo:

1. Instale as dependências uma vez: `pnpm install` (o projeto usa **pnpm**, não npm; se o comando não existir, rode `corepack enable` ou `npm i -g pnpm@9.15.9`).
2. Edite o arquivo.
3. Veja o resultado:
   - Site: `pnpm dev` e abra `http://localhost:5173/ufabc/campi`. A página atualiza ao salvar.
   - Conteúdo do PDF: com o `dev` rodando, abra `http://localhost:5173/print`. Você vê o conteúdo e a paginação, desde que o Paged.js esteja instalado (é dependência opcional).
4. Antes de publicar, confira o formato dos `.md` com `pnpm lint:content` (mostra arquivo e linha de cada erro), rode `pnpm test` e confira se compila: `pnpm build` (checa os tipos e gera `dist/`). O CI do GitHub roda os mesmos passos e gera o PDF a cada push.
5. Para gerar o arquivo PDF:
   ```bash
   pnpm build
   pnpm preview        # deixe rodando (http://localhost:4173)
   pnpm pdf            # em outro terminal; grava dist/guia.pdf
   ```
   O `pnpm pdf` exige `playwright` e `pagedjs` instalados (dependências opcionais). A URL e o destino podem ser mudados com as variáveis `PREVIEW_URL` e `PDF_OUTPUT`.

Mudanças de texto em `content/*.md` não exigem mexer em código. Os `.md` devem estar em **LF**, não CRLF (veja "Pontos a verificar").

## 5. Formatação dos arquivos Markdown

### Cabeçalho (frontmatter)

Todo `.md` começa com um bloco entre `---`, lido por `content.ts`. O leitor é simples: aceita só linhas `chave: valor` (texto, número, `true`/`false`), sem listas nem blocos aninhados.

| Campo | Para que serve | Se faltar |
|---|---|---|
| `title` | Título da página (sumário, abertura da parte, PDF) | usa o nome do arquivo |
| `order` | Posição global; define a ordem no PDF e o anterior/próximo | 999 |
| `route` | Endereço no site (ex.: `/ufabc/campi`) | derivado do caminho do arquivo |
| `section` | Parte do manual: `ufabc`, `bct` ou `bcc` | derivado da pasta |
| `pdf` | `true` inclui a página no PDF | `false` |
| `description` | Resumo curto | vazio |

### Convenções do corpo

- Um único `# Título` no início (o PDF o remove e usa o `title`).
- O **primeiro parágrafo** depois do título vira o resumo em destaque no PDF. Escreva-o como introdução.
- Seções com `##` (viram itens numerados 01, 02, 03... no PDF, automaticamente) e subseções com `###`. Evite níveis mais fundos; o índice lateral só considera `##` e `###`.
- Listas com `-`, tabelas no formato padrão com `|`, ênfase com `**negrito**`.
- Avisos usam a sintaxe do GitHub: `> [!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]` ou `[!CAUTION]`. No PDF recebem o rótulo "Observacao", "Dica", "Atencao" ou "Importante".
- Atributos extras entre chaves após um elemento (plugin `markdown-it-attrs`), por exemplo `## Título {#meu-id}`.
- HTML puro é permitido, mas evite.
- Links externos funcionam normalmente. Para link interno use a rota: `[matrícula](/ufabc/matricula)`.
- Nenhum `.md` atual usa imagens. Se precisar, ponha o arquivo em `public/` e referencie por caminho absoluto (`/imagem.png`), mas teste antes: não há convenção estabelecida.

### Elementos editoriais

Implementados em `markdown.ts` (sem dependência extra). Mesma sintaxe no site e no PDF.

**Dica** (caixa amarela cheia no PDF, amarelo claro no site). Sintaxe principal:

```markdown
> [!TIP]
> Texto da dica em uma ou mais linhas,
> continuando com o `>` no começo.
```

Alias equivalente (gera o mesmo HTML):

```markdown
:::dica
Texto da dica.
:::
```

**Selos de conceito.** Não há sintaxe nova: em qualquer tabela cuja **primeira coluna se chama "Conceito"** (cabeçalho exato), as letras A, B, C, D, F, O e I sozinhas numa célula viram selos coloridos. Verde: A, B, C. Amarelo: D. Vermelho: F, O. Cinza: I.

```markdown
| Conceito | Significado      |
| -------- | ---------------- |
| A        | Desempenho excepcional |
| B        | Desempenho acima da média |
| C        | Desempenho médio |
```

**Cartões CR/CA/CP.** Contêiner externo com `::::` (4 dois-pontos) e cartões internos com `:::` (3):

```markdown
::::cards
:::card CR | Rendimento
Texto explicando o CR.
:::
:::card CA | Aproveitamento
Texto explicando o CA.
:::
:::card CP | Progressão
Texto explicando o CP.
:::
::::
```

A sigla aparece grande (fonte Anton) e o subtítulo vem depois do `|`. Borda superior: azul para CR, verde para CA, amarelo para CP (e demais).

Estilo impresso: `PdfMarkdownPages.vue` e `print.css`. Estilo web: `MarkdownPage.vue`.

### Exemplo

```markdown
---
title: Matrícula e ajustes
order: 20
route: /ufabc/matricula
section: ufabc
pdf: true
description: Como funciona a matrícula e o período de ajustes.
---

# Matrícula e ajustes

A matrícula em disciplinas é feita todo quadrimestre pelo sistema da UFABC.

## Prazos

- **Matrícula:** antes do início das aulas.
- **Ajustes:** primeira semana de aulas.

> [!WARNING]
> Perder o prazo pode deixar você sem vaga nas disciplinas.

| Etapa | Quando |
|---|---|
| Matrícula | Pré-início |
| Ajustes | Semana 1 |
```

## 6. Relação Markdown, Vue e CSS

O ciclo do PDF tem três etapas:

1. **Markdown (`content/*.md`)**: apenas texto e estrutura, sem aparência.
2. **Vue**: `content.ts` lê o arquivo, `markdown.ts` o converte em HTML, e `PdfMarkdownPages.vue` encaixa esse HTML numa moldura (selo com número, rótulo da parte, título grande, resumo). O HTML do Markdown é inserido com `v-html`.
3. **CSS**: dois níveis cuidam da aparência.
   - Dentro de `PdfMarkdownPages.vue`, regras com `:deep(...)` estilizam o HTML gerado (títulos `##`, listas, tabelas, avisos, numeração 01/02/03 por contador CSS).
   - `print.css` cuida da página física.

Quem manda no layout do PDF é o **`print.css`**. É ele que define:

- tamanho e margens da página (`@page`), página da capa (`@page :first`) e aberturas de parte (`@page opener`, sem margem);
- cabeçalho e rodapé: o título do `h1[data-pdf-section]` e o atributo `data-section-label` do `<article>` alimentam o texto corrente via `string-set`;
- numeração de páginas e números do sumário (`target-counter`);
- quebras de página (`.page-break-before`) e o que não deve ser cortado (`break-inside: avoid`).

Por isso, para mudar margens, cabeçalho, rodapé ou quebras, edite o `print.css`. Para mudar a tipografia do texto no PDF, edite o bloco `<style>` de `PdfMarkdownPages.vue`.

No site, o CSS vem de `main.css`, `theme.css` e das classes Tailwind nos próprios componentes. O `print.css` só é carregado na rota `/print`, então não afeta o site.

## 7. Como adicionar uma nova página

1. **Crie o `.md`** na pasta da seção (`content/ufabc/`, `content/bct/` ou `content/bcc/`) com o frontmatter da seção 5. Escolha um `order` que a encaixe na sequência (atuais: ufabc 10 a 40, bct 50 a 65, bcc 70 a 90).
2. **PDF**: com `pdf: true` e `section` correta, a página entra sozinha, na posição do `order`, e aparece na lista de capítulos de `PdfParte`.
3. **Site (BC&T/BCC)**: adicione uma linha `[caminho, nome, seção, título]` em `mdRoutes([...])` no `src/app/router.ts` (caminho igual ao `route`) e o item no menu em `src/features/navigation/Sidebar.vue`. Nenhum `.vue` novo.
   **Site (UFABC)**: crie `src/pages/ufabc/NovaPage.vue` (modelo: `CampiPage.vue`), exporte em `src/pages/ufabc/index.ts` e registre a rota em `router.ts`.
4. **Sumário do PDF**: automático, vem do `.md`. Nada a fazer.
5. **Verifique**: `pnpm dev`, abra a rota nova e `/print` para ver a página no PDF. Rode `pnpm build` para garantir que compila.

## Pontos a verificar

- **UFABC com duas fontes de texto.** `CampiPage.vue` etc. não leem o Markdown. Editar só o `.md` não altera o site da UFABC (BC&T e BCC não têm esse problema).
- **Grade com dados ilustrativos.** `PdfGrade.vue` tem disciplinas e códigos inventados. Pendente: substituir pelos reais.
- **Line endings.** O parser de frontmatter (`content.ts`) exige `---\n`: os `.md` devem estar em **LF**. Se um `.md` sumir do PDF, suspeite primeiro de CRLF (VSCode, canto inferior direito: troque para LF e salve). Hoje todos estão em LF.
- **Partes fixas em vários lugares**: `PARTS` (`PdfMarkdownPages`), `PARTES` (`PdfSumario`), `SECTIONS` (`MarkdownPage`), `NAV` (`Sidebar`), `Header`.
- **Código possivelmente morto**: `PdfTexto.vue` (exportado em `print/index.ts`, nunca usado), `PdfTabela.vue` (fora do `PrintPage`), `ROUTES` em `shared/config/routes.ts` (ninguém importa), `extractToc` e `getPageByRoute`.
- **`index.md` com `pdf: true`** é ignorado no PDF (a rota `/` é pulada).
- **Comentários desatualizados**: `PrintLayout.vue` cita `@shared/lib/pdf.ts`, que não existe; `routes.ts` diz que o `router.ts` importa dele, o que é falso.
- **Imagens**: não há exemplo de uso em `content/`, então a convenção é indefinida.
- **Pasta `examples/mockups/`** contém alguns arquivos com nomes quebrados (ex.: `mockups${f}.dc.html`), provavelmente lixo de um comando de cópia que falhou.
- **Docs antigos**: `README.md` e `ARCHITECTURE.md` existem na raiz e não foram revisados; podem divergir deste guia.
