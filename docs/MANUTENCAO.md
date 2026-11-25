# Manutenção: receitas passo a passo

Complemento prático do `docs/GUIA.md`. O guia explica **como o projeto funciona**; este documento diz **o que fazer** em cada tarefa comum. Caminhos são relativos à raiz do repositório.

## Antes de começar: o mapa atual

Leia isto uma vez. O PDF gerado é A4 retrato (51 páginas na última geração), com capa, índice, aberturas de parte, páginas internas e grade curricular.

| Parte | Como o **site** é feito | Como o **PDF** é feito |
|---|---|---|
| Parte 1 · UFABC (`/ufabc/*`) | Um `.vue` por página em `src/pages/ufabc/`, com o texto escrito no próprio arquivo | A partir de `content/ufabc/*.md` |
| Parte 2 · BC&T (`/bct/*`) | A partir de `content/bct/*.md` (componente `MarkdownPage.vue`) | A partir dos mesmos `content/bct/*.md` |
| Parte 3 · BCC (`/bcc/*`) | A partir de `content/bcc/*.md` (`MarkdownPage.vue`) | A partir dos mesmos `content/bcc/*.md` |
| Início (`/`) | `src/pages/home/HomePage.vue` | Não entra (a rota `/` é ignorada no PDF) |

Em resumo: **BC&T e BCC têm uma fonte só** (o `.md`). **UFABC ainda tem duas** (o `.vue` para o site, o `.md` para o PDF).

Regra de ouro: toda página que entra no PDF precisa de um `.md` em `content/` com `pdf: true`. Todo o resto (sumário do PDF, numeração, abertura de parte, anterior/próximo) é derivado desses `.md`.

---

## Receita 1. Adicionar uma nova página web

Há dois caminhos. Escolha um.

**Caminho A (recomendado para BC&T e BCC): página vinda de Markdown.** É a Receita 3, parte "site". Não exige escrever `.vue`.

**Caminho B: página com `.vue` próprio** (como as da UFABC, as únicas que ainda existem em `src/pages/`; `src/pages/bct/` e `src/pages/bcc/` foram removidas). Use quando a página precisa de layout que o Markdown não dá.

Exemplo: criar uma página "Bolsas (demo)" na UFABC, rota `/ufabc/bolsas-demo`. Apague depois do treino.

### Passo 1. Criar o componente

Crie `src/pages/ufabc/BolsasDemoPage.vue`. Use `CampiPage.vue` como modelo (copie e troque o texto).

```vue
<script setup lang="ts">
import DocLayout from '../_layouts/DocLayout.vue'
</script>

<template>
  <DocLayout title="Bolsas (demo)" parte="Parte 1 · UFABC" section="ufabc" tema="amarelo">
    <template #toc>
      <ul class="list-none m-0 p-0">
        <li><a href="#o-que-e" class="block py-1 text-fg-muted text-[13px] no-underline">O que é</a></li>
      </ul>
    </template>

    <h2 id="o-que-e">O que é</h2>
    <p>Texto da página escrito direto aqui.</p>
  </DocLayout>
</template>
```

### Passo 2. Exportar no "barrel" da pasta

Acrescente em `src/pages/ufabc/index.ts`:

```ts
export { default as BolsasDemoPage } from './BolsasDemoPage.vue'
```

### Passo 3. Registrar a rota

Em `src/app/router.ts`, dentro da lista `routes`, na seção da parte correspondente, adicione:

```ts
{
  path:      '/ufabc/bolsas-demo',
  name:      'ufabc-bolsas-demo',
  component: () => import('@pages/ufabc').then(m => m.BolsasDemoPage),
  meta:      { section: 'ufabc', title: 'Bolsas (demo)' },
},
```

O `name` precisa ser único. A rota deve vir **antes** da rota "coringa" `/:pathMatch(.*)*` (o fallback no fim da lista).

### Passo 4. Colocar no menu

O menu lateral é uma lista escrita à mão em `src/features/navigation/Sidebar.vue`, na constante `NAV`. Acrescente dentro da parte certa:

```ts
{ t: 'Bolsas (demo)', href: '/ufabc/bolsas-demo' },
```

O menu do topo (`Header.vue`) só tem um link por parte (UFABC, BC&T, BCC); não precisa mexer, salvo se criar uma parte nova (Receita 4).

### Passo 5. Conferir

```bash
pnpm dev
```

Abra `http://localhost:5173/ufabc/bolsas-demo`. Confirme: a página abre, o item aparece no menu e fica destacado.

Observação: páginas sem `.md` correspondente **não têm** rodapé "anterior / próximo", porque ele lê a ordem dos `.md` (ver Receita 3). Isso não é erro.

O arquivo `src/shared/config/routes.ts` também lista rotas, mas **ninguém o importa** (ver "Observações"); não precisa atualizá-lo.

---

## Receita 2. Adicionar uma nova página só no PDF

### Passo 1. Criar o `.md`

Crie `content/<area>/<nome>.md`, onde `<area>` é `ufabc`, `bct` ou `bcc`. Exemplo: `content/ufabc/bolsas.md`.

```markdown
---
title: Bolsas e auxílios
order: 35
route: /ufabc/bolsas
section: ufabc
pdf: true
description: Bolsas e auxílios oferecidos pela UFABC.
---

# Bolsas e auxílios

Primeiro parágrafo: vira o resumo em destaque do PDF.

## Primeira seção

Texto da seção.
```

### Passo 2. Escolher o `order`

O `order` define a posição global. Valores usados hoje: ufabc 10 a 40, bct 50 a 65, bcc 70 a 90, apresentação 0. Escolha um número entre os vizinhos desejados (ex.: 35 fica entre `avaliacao` = 30 e `projetos` = 40). O `order` ordena a página **dentro da sua seção**; a ordem das seções no PDF é fixa (UFABC, BC&T, BCC).

### Passo 3. A flag que controla o PDF

O campo é `pdf: true` (em `src/shared/lib/content.ts`, campo `pdf`; só `true` conta, ausente vale `false`). Sem ele a página existe para o resto do sistema, mas **não** entra no PDF.

### Passo 4. Conferir

1. `pnpm dev` e abra `http://localhost:5173/print`.
2. Procure a página: ela deve aparecer sob a abertura da parte certa, com um selo numerado (ex.: `1.5`) e na lista de capítulos da abertura.
3. O sumário (`Sumário`, no início) também deve listá-la: ele é gerado a partir dos mesmos `.md`.
4. Para ver o PDF de verdade, siga a Receita 9.

Se a página tem `pdf: true` mas **nenhuma rota no site**, ela entra no PDF e simplesmente não abre no navegador. Para que abra, faça a Receita 3.

---

## Receita 3. Adicionar uma página que aparece no site e no PDF

### Caso BC&T ou BCC (fonte única)

1. Crie o `.md` como na Receita 2, com `pdf: true`, `section: bct` (ou `bcc`) e `route: /bct/<nome>`.
2. Registre a rota em `src/app/router.ts`, dentro do bloco `mdRoutes([...])` da parte. Cada linha tem o formato `[caminho, nome, seção, título]`:

   ```ts
   ...mdRoutes([
     ['/bct/sobre',    'bct-sobre',    'bct', 'O que é o BC&T'],
     ['/bct/matriz',   'bct-matriz',   'bct', 'Matriz curricular do BC&T'],
     ['/bct/extensao', 'bct-extensao', 'bct', 'Extensão, apoio e formação complementar'],
     ['/bct/novidade', 'bct-novidade', 'bct', 'Título da página nova'],   // linha nova
   ]),
   ```

   O `caminho` deve ser **idêntico** ao campo `route` do `.md`: é assim que `MarkdownPage.vue` acha o arquivo.
3. Adicione o item no menu (`NAV` em `Sidebar.vue`), como na Receita 1, passo 4.
4. Confira no site (`pnpm dev`, abra a rota) e no PDF (`/print`).

Aqui o texto é o mesmo nos dois: editar o `.md` altera site e PDF.

### Caso UFABC (duas fontes separadas)

1. Faça a Receita 2 (o `.md`, para o PDF).
2. Faça a Receita 1, caminho B (o `.vue`, para o site), em `src/pages/ufabc/`, exportando em `src/pages/ufabc/index.ts`.
3. Use o **mesmo** `route` no `.md` e no `path` do `router.ts`, para o anterior/próximo e o PDF apontarem para a página certa.

**Alerta:** nesse caso o texto **não é compartilhado**. O `.vue` tem um texto e o `.md` tem outro. Se você quer que fiquem iguais, precisa copiar e manter os dois. Alternativa mais simples: servir a página UFABC também por `mdRoutes` (como BC&T/BCC), eliminando o `.vue`. Isso é uma mudança maior (as páginas UFABC existentes são `.vue`); só faça com intenção.

---

## Receita 4. Adicionar uma nova seção ("parte")

Exemplo: "Parte 4 · Carreira", pasta `content/carreira/`, `section: carreira`.

Hoje a lista de partes está **repetida em vários arquivos**, todos escritos à mão. Os passos abaixo cobrem cada um. Confira todos.

### Passo 1. Conteúdo

Crie `content/carreira/` com ao menos um `.md` (`section: carreira`, `pdf: true`, `order` maior que todos os atuais, ex.: 100 em diante).

### Passo 2. Abertura e agrupamento no PDF

Em `src/pages/print/PdfMarkdownPages.vue`:

- No objeto `PARTS`, adicione a entrada (copie e adapte uma existente): `key`, `num` (`'04'`), `label`, `titulo`, `subtitulo`, `tema` (`'amarelo'` ou `'azul'`) e `seed` (número usado no desenho do wafer da abertura; qualquer inteiro).
- Mais abaixo, a lista fixa `['ufabc', 'bct', 'bcc']` define a ordem das partes. Acrescente `'carreira'`.

### Passo 3. Sumário

Em `src/pages/print/PdfSumario.vue`:

- No objeto `PARTES`, adicione `carreira: { num: 4, texto: '...' }`.
- Na lista fixa `['ufabc', 'bct', 'bcc']` dentro de `entradas`, acrescente `'carreira'`.

As **páginas** do sumário vêm dos `.md`; só as **partes** são fixas nesses dois pontos.

### Passo 4. Abertura de parte

`PdfParte.vue` recebe os dados por props (vindos de `PARTS`) e lista os capítulos a partir de `content/` pela `section`. Não precisa de edição; na primeira geração, confira número grande, título e lista.

### Passo 5. Numeração

Não há número escrito à mão nas páginas. O selo da página (`4.1`, `4.2`...) é `num da parte` + `posição da página dentro da parte`, calculado automaticamente. O número da parte vem do `num` de `PARTS`/`PARTES`: mantenha-o igual nos dois.

### Passo 6. Site

- `src/pages/content/MarkdownPage.vue`: no objeto `SECTIONS`, adicione a chave `carreira` (`parte`, `label`, `root` = rota da primeira página, `tema`). Sem isso a página cai no visual de `ufabc`.
- `src/features/navigation/Sidebar.vue`: novo bloco em `NAV`.
- `src/features/navigation/Header.vue`: novo link na lista do topo (as chaves `ufabc`/`bct`/`bcc` ficam por volta da linha 31).
- `src/app/router.ts`: bloco `mdRoutes([...])` com as rotas.
- `src/pages/_layouts/DocLayout.vue` pode ter restrições de tipo para `section`; se o `pnpm build` reclamar, ajuste o tipo apontado.

### Passo 7. Conferir

`pnpm build` (os tipos acusam esquecimentos), depois `/print` e o site.

---

## Receita 5. Editar o texto de uma página existente

O texto mora em lugares diferentes conforme a página.

| Página | Site (edite) | PDF (edite) |
|---|---|---|
| `/ufabc/campi` | `src/pages/ufabc/CampiPage.vue` | `content/ufabc/campi.md` |
| `/ufabc/matricula` | `src/pages/ufabc/MatriculaPage.vue` | `content/ufabc/matricula.md` |
| `/ufabc/avaliacao` | `src/pages/ufabc/AvaliacaoPage.vue` | `content/ufabc/avaliacao.md` |
| `/ufabc/projetos` | `src/pages/ufabc/ProjetosPage.vue` | `content/ufabc/projetos.md` |
| `/bct/sobre`, `/bct/matriz`, `/bct/extensao` | `content/bct/<nome>.md` | o mesmo `.md` |
| `/bcc/sobre`, `/bcc/grade`, `/bcc/ppc` | `content/bcc/<nome>.md` | o mesmo `.md` |
| `/` (início) | `src/pages/home/HomePage.vue` | não entra no PDF (`content/index.md` é ignorado) |

Resumo do dilema:

- **UFABC**: dois arquivos, dois textos. Para manter iguais, edite os dois.
- **BC&T e BCC**: um arquivo. Edite o `.md` e pronto.
- **Capa**: `src/pages/print/PdfCapa.vue` (só PDF).

Passos:

1. Abra o arquivo certo e edite o texto. Em `.vue`, cuide para não apagar tags `<p>`, `</div>` etc.
2. Veja no navegador: `pnpm dev`; site em `http://localhost:5173/<rota>`, PDF em `/print`.
3. Se mudou um título `##`/`###` que era alvo de link do menu (por exemplo `/bct/extensao#conclusao-de-curso` no `Sidebar.vue`), atualize o link: o trecho depois de `#` é o título em minúsculas, sem acentos, com hífens.

---

## Receita 6. Alterar o sumário do PDF

Hoje o sumário **é gerado** a partir dos `.md` com `pdf: true`: títulos e ordem vêm de `title` e `order`. Para mudar uma entrada, mude o `.md`:

1. Texto da entrada: campo `title` do frontmatter.
2. Posição: campo `order`.
3. Tirar uma página do sumário e do PDF: `pdf: false` (ou apague a linha).

O que ainda é escrito à mão em `src/pages/print/PdfSumario.vue`:

- O objeto `PARTES` (número e título de cada parte, por exemplo "BC&T — Bacharelado em Ciência e Tecnologia").
- A lista de partes `['ufabc', 'bct', 'bcc']`.

Fragilidade: esses nomes de parte também aparecem em `PdfMarkdownPages.vue` (objeto `PARTS`) e na abertura da parte. Se mudar um, mude os outros, ou o sumário e as aberturas dirão coisas diferentes. Os números de página são preenchidos automaticamente pelo Paged.js; nunca digite números de página.

Para conferir: `/print` com o `dev` rodando, ou gere o PDF (Receita 9).

---

## Receita 7. Tabelas e grade curricular

### Tabelas simples dentro do texto

Use tabelas Markdown no `.md` (sintaxe na Receita 8). Exemplos reais: `content/bct/matriz.md`, `content/bcc/ppc.md`.

### Grade curricular: `PdfGrade.vue`

A grade é a última página do PDF (A4 retrato) e tem os dados escritos dentro do componente, no `<script setup>`. **Pendente: os dados são ilustrativos** (disciplinas e códigos inventados) e precisam ser substituídos pelos reais, validados contra o PPC oficial, quando disponíveis.

- `src/pages/print/PdfGrade.vue`: array `disciplinas` (cada item: `codigo`, `nome`, `cred`, `tipo`, `quad` de 1 a 13), constante `QUADS` e legenda `legenda`. Para adicionar uma disciplina, inclua uma linha, por exemplo:

  ```ts
  { codigo: 'MCTA999', nome: 'Disciplina Nova', cred: 4, tipo: 'obrig', quad: 5 },
  ```

  `tipo` aceita `'obrig'`, `'optativa'`, `'extensao'` ou `'tcc'`.

`PrintPage.vue` inclui `PdfGrade` (ordem: capa, sumário, páginas `.md`, grade). `PdfTabela.vue` **não** é incluído: a comparação entre PPCs vem de `content/bcc/ppc.md`. Se `PdfTabela` voltar à composição, haverá conteúdo repetido.

---

## Receita 8. Formatação dos arquivos `.md`

### Nome e local

- Pasta = parte: `content/ufabc/`, `content/bct/`, `content/bcc/`. O arquivo da apresentação é `content/index.md`.
- Nome em minúsculas, sem acento nem espaço, extensão `.md` (ex.: `extensao.md`).
- Se o frontmatter omitir `route`/`section`, o sistema deduz do caminho (`content/bct/matriz.md` vira `/bct/matriz`, seção `bct`). Mesmo assim, escreva sempre os campos explicitamente, como os arquivos atuais.
- **Os `.md` precisam estar em LF, não CRLF.** O leitor de frontmatter procura `---` seguido de `\n`; com CRLF não reconhece o cabeçalho e a página perde título, `order` e `pdf` (some do PDF). Se um `.md` sumir do PDF, suspeite disso primeiro. No VSCode, canto inferior direito: troque `CRLF` por `LF` e salve. Hoje todos estão em LF.

### Frontmatter

Bloco entre duas linhas `---`, na primeiríssima linha do arquivo. Só aceita `chave: valor` numa linha (sem listas, sem blocos).

| Campo | Obrigatório? | Para que serve | Se faltar |
|---|---|---|---|
| `title` | sim | Título na página, sumário, abertura de parte | usa o nome do arquivo |
| `order` | sim | Ordem no PDF, no anterior/próximo | 999 (vai para o fim) |
| `route` | sim | Endereço no site; liga o `.md` à rota | deduzido do caminho |
| `section` | sim | `ufabc`, `bct` ou `bcc` (ou parte nova) | deduzido da pasta |
| `pdf` | sim para entrar no PDF | `true` inclui no PDF | `false` |
| `description` | não | Resumo curto | vazio |

Valores `true`/`false` e números são reconhecidos; aspas em volta do texto são removidas. Textos com dois-pontos (`:`) no valor funcionam, pois só o primeiro `:` separa chave de valor.

### Títulos (headings)

- `# Título`: **um único**, na primeira linha do corpo. Site e PDF o removem do corpo e mostram o `title` do frontmatter no lugar. Mantenha os dois iguais.
- Primeiro parágrafo depois do `#`: vira o **resumo em destaque** (lead) no site e no PDF. Escreva-o como introdução, em texto corrido. Se começar por lista, tabela ou aviso, o site não o trata como resumo.
- `##`: seções principais. No PDF são numeradas automaticamente (01, 02...). Entram no índice lateral do site.
- `###`: subseções. Também entram no índice lateral.
- Evite `####` ou mais fundo: não entram no índice lateral.
- Cada título recebe um id automático (ex.: `## Conclusão de curso` vira `#conclusao-de-curso`), usado em links como `/bct/extensao#conclusao-de-curso`.

Qual nível vira "título de página" no PDF? O `title` do frontmatter. Os `#` não aparecem.

### Elementos

- Listas: `-` para itens, `1.` para numeradas; sublistas com 2 espaços de recuo.
- Ênfase: `**negrito**`, `*itálico*`.
- Tabelas: sintaxe com `|` e linha `|---|---|` (veja o exemplo).
- Links externos: `[texto](https://...)`.
- Links internos: use a rota, `[matrícula](/ufabc/matricula)`, com âncora opcional `/bct/extensao#conclusao-de-curso`.
- Imagens: **nenhum `.md` atual usa imagem** e a pasta `public/` está vazia, então não há convenção testada. Hipótese: colocar o arquivo em `public/` e referenciar com caminho absoluto (`![texto](/imagem.png)`). Teste no site e no PDF antes de confiar (a confirmar).
- Avisos (callouts): em citação com marcador na primeira linha.

  ```markdown
  > [!TIP]
  > Texto da dica.
  ```

  Tipos aceitos: `NOTE`, `TIP`, `WARNING`, `IMPORTANT`, `CAUTION`. Rótulos exibidos: Observação, Dica, Importante e Atenção (WARNING e CAUTION). `TIP` é a caixa amarela "Dica" (cheia no PDF, clara no site); há alias `:::dica` ... `:::`.
- Selos de conceito e cartões CR/CA/CP: ver "Elementos editoriais" logo abaixo e a Receita 12.
- Atributos entre chaves: `## Título {#id-personalizado}` define o id do título.
- HTML cru é permitido, mas evite.
- Aspas e travessões "inteligentes" são aplicados automaticamente (opção `typographer`), e URLs soltas viram links (`linkify`).

### Elementos editoriais

Implementados em `src/shared/lib/markdown.ts` (contêineres `:::` inline, sem dependência nova). Estilo impresso: `PdfMarkdownPages.vue` + `print.css`; web: `MarkdownPage.vue`.

**Dica** (já usada em 8 pontos dos `.md`):

```markdown
> [!TIP]
> Texto da dica em uma ou mais linhas,
> continuando com o `>` no começo.
```

Alias equivalente (mesmo HTML):

```markdown
:::dica
Texto da dica.
:::
```

**Selos de conceito (A, B, C, D, F, O, I).** Sem sintaxe nova: em tabela cuja **primeira coluna se chama "Conceito"** (cabeçalho exato), as letras sozinhas nas células viram selos. Verde: A, B, C. Amarelo: D. Vermelho: F, O. Cinza: I. Exemplo no PDF: p.11 (Avaliação).

```markdown
| Conceito | Significado      |
| -------- | ---------------- |
| A        | Desempenho excepcional |
| B        | Desempenho acima da média |
| C        | Desempenho médio |
```

**Cartões CR/CA/CP.** Contêiner externo `::::` (4 dois-pontos), cartões internos `:::` (3). Exemplo no PDF: p.12.

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

### Exemplo completo

```markdown
---
title: Estágio e bolsas
order: 66
route: /bct/estagio
section: bct
pdf: true
description: Como funcionam estágio e bolsas no BC&T.
---

# Estágio e bolsas

Este capítulo explica o que o BC&T prevê sobre estágio e quais bolsas
você pode pedir. Este primeiro parágrafo vira o resumo em destaque.

## Estágio

O estágio **não é obrigatório**, mas é regulamentado. Veja também a
[matrícula](/ufabc/matricula) e o [site da UFABC](https://www.ufabc.edu.br).

### Quando fazer

- Depois de cumprir as horas complementares.
- Com carga que caiba junto às aulas.
  - Evite concentrar disciplinas pesadas no mesmo quadrimestre.

> [!TIP]
> Converse com a coordenação antes de formalizar o estágio.

## Bolsas

| Bolsa | Quem oferece | Observação |
|---|---|---|
| PIC | UFABC | Aceita voluntários |
| PIBIC | CNPq | Cota anual |

> [!WARNING]
> Perder o prazo do edital pode custar um ano de espera.
```

Depois de criar, registre a rota (Receita 3) e confira site e PDF.

---

## Receita 9. Rodar o projeto localmente

Comandos extraídos do `package.json` (scripts `dev`, `build`, `preview`, `pdf`, `pdf:check`, `test`, `lint:content`). O gerenciador de pacotes é o **pnpm** (não use `npm install`, que criaria um `package-lock.json` indesejado).

### Instalar (uma vez, ou quando o `package.json` mudar)

Requer Node 18.12+ e pnpm. Se o `pnpm` não existir no terminal, ative-o com `corepack enable` (usa a versão fixada em `package.json`) ou instale com `npm i -g pnpm@9.15.9`.

```bash
pnpm install
```

`playwright` e `pagedjs` são dependências opcionais, necessárias para gerar o PDF. Se a instalação delas falhar, o site funciona mas o `pnpm pdf` não. Na primeira vez, o Playwright pode pedir para baixar o navegador:

```bash
pnpm exec playwright install chromium
```

### Site em modo desenvolvimento

```bash
pnpm dev
```

Abra `http://localhost:5173`. Atualiza sozinho ao salvar. Para ver o conteúdo do PDF paginado: `http://localhost:5173/print`.

### Build (checa tipos e gera `dist/`)

```bash
pnpm build
```

Executa `vue-tsc -b && vite build`. Se falhar, leia a primeira mensagem de erro.

### Preview do build

```bash
pnpm preview
```

Serve `dist/` em `http://localhost:4173`. Deixe rodando.

### Gerar o PDF

Em dois terminais, com `build` já feito:

```bash
# terminal 1
pnpm preview

# terminal 2
pnpm pdf
```

Saída padrão: `dist/guia.pdf`. Variáveis opcionais (`PREVIEW_URL`, `PDF_OUTPUT`):

```powershell
# PowerShell
$env:PDF_OUTPUT = "dist/manual.pdf"
$env:PREVIEW_URL = "http://localhost:4173"
pnpm pdf
```

```bash
# Git Bash
PDF_OUTPUT=dist/manual.pdf pnpm pdf
```

O script abre `/print`, confere que cada página com `pdf: true` foi renderizada (e que o navegador não registrou erros), espera o Paged.js terminar (até 60 s) e salva. Imprime mensagens `[pdf] ...`; termina com `[pdf] Pronto.`.

Para conferir o arquivo gerado (PDF íntegro, tamanho plausível, páginas suficientes):

```bash
pnpm pdf:check
```

### Lint e testes

```bash
pnpm lint:content   # aponta arquivo e linha de erros de formato nos .md
pnpm test           # testes do renderizador Markdown e da estrutura do conteúdo
```

O `lint:content` acusa: frontmatter incompleto, `order` não numérico, rota inválida ou duplicada, container `:::` sem fechar ou desconhecido, `:::card` sem argumento, callout `[!X]` inválido, link interno para página inexistente, mais de um `#` ou pulo de nível de título. As regras ficam em `eslint-rules/manual-plugin.js`; se criar um container ou callout novo, atualize as constantes no topo desse arquivo e o `src/shared/lib/markdown.ts`.

### CI (GitHub Actions)

O arquivo `.github/workflows/ci.yml` roda a cada push na `main` e a cada pull request: `lint:content`, `test` e `build`; depois gera o PDF, roda `pdf:check` e guarda o arquivo como artefato `guia-pdf`. Um ✗ vermelho no commit significa que algum desses passos falhou: abra a execução e leia o log. O CI usa `pnpm install --frozen-lockfile`, então depois de mudar dependências faça o commit do `pnpm-lock.yaml` junto com o `package.json`.

---

## Receita 10. Checklist antes de commitar

1. `pnpm lint:content`, `pnpm test` e `pnpm build` terminam sem erros (o CI roda os mesmos).
2. A página nova abre no site (`pnpm dev`) e aparece no menu lateral.
3. A página nova aparece em `http://localhost:5173/print`, sob a parte correta.
4. O sumário do PDF a lista (ele é gerado, mas confira o título e a posição).
5. Se criou ou renomeou um título `##`, confira links com `#` no `Sidebar.vue`.
6. Se editou uma página da UFABC, editou **também** o outro arquivo (`.vue` e `.md`) quando quer os dois iguais.
7. Nenhum `console.log` esquecido (hoje não há nenhum em `src/`): `Grep` ou busca do editor por `console.log`.
8. Nada editado em `node_modules/` ou `dist/` (não são versionados nem devem ser editados).
9. `git status` mostra só os arquivos que você pretendia mexer.
10. Opcional: gere o PDF (Receita 9) e folheie as páginas alteradas.

---

## Receita 11. Problemas comuns

| Sintoma | Verifique |
|---|---|
| Página nova não aparece no site (cai em "Página não encontrada") | Rota não registrada em `src/app/router.ts`, ou `path` diferente do `route` do `.md`, ou rota colocada depois do fallback `/:pathMatch(.*)*`. Reinicie o `pnpm dev` se mudou o `router.ts` e nada mudou. |
| Rota abre, mas vazia / sem título | O `route` do `.md` não bate exatamente com o endereço (barra a mais, maiúsculas), ou o `.md` não está em `content/`. |
| Página aparece no site, mas não no menu | Falta o item em `NAV` (`Sidebar.vue`). O menu não é gerado automaticamente. |
| Página nova não aparece no PDF | `pdf: true` ausente ou escrito errado; `section` diferente de `ufabc`/`bct`/`bcc` (partes desconhecidas são ignoradas); `route: /` (a rota `/` é pulada); frontmatter não começa na primeira linha ou não fecha com `---`; arquivo em CRLF. |
| Título da página virou o nome do arquivo (ex.: `ufabc/campi.md`) | Frontmatter não reconhecido: `---` fora da linha 1, `---` de fechamento faltando, ou arquivo salvo com **CRLF** (troque para LF). |
| Cartões ou selos não aparecem | Cartões: `::::cards` externo e `:::` fechando cada `:::card`. Selos: o cabeçalho da primeira coluna deve ser exatamente `Conceito` e a célula só a letra (A, B, C, D, F, O ou I). |
| Página aparece na ordem errada | Valor de `order`. Sem ele vale 999. |
| Anterior/próximo aponta para página inesperada ou inexistente | Ele segue o `order` de **todos** os `.md`, inclusive os sem rota no site. |
| PDF em branco, incompleto ou sem paginação | Rodou `pnpm build` antes? O `pnpm preview` está rodando na porta 4173? Se o script reclama de `playwright`/`pagedjs`, reinstale (`pnpm install`). |
| `pnpm pdf` dá "timeout" esperando o Paged.js | O preview não está de pé ou a página `/print` tem erro. Abra `http://localhost:4173/print` no navegador e veja o console. |
| `pnpm pdf` falha com navegador não encontrado | Rode `pnpm exec playwright install chromium`. |
| PDF antigo mesmo depois de editar | O preview serve `dist/` (build antigo). Refaça `pnpm build`, reinicie o preview. |
| Imagem não aparece | Caminho: coloque o arquivo em `public/` e use caminho absoluto (`/nome.png`); confira maiúsculas/minúsculas e extensão. Não há convenção testada (a confirmar). |
| Aviso (`> [!TIP]`) apareceu como citação comum | O marcador precisa estar sozinho na primeira linha da citação e em maiúsculas, com um dos 5 tipos válidos. |
| Alteração de `.md` não aparece no site da UFABC | Esperado: as páginas UFABC do site são `.vue`. Edite também o `.vue`. |
| `pnpm build` acusa erro de tipo após criar parte nova | Falta o novo `section` em algum objeto tipado (`SECTIONS`, `PARTS`, `PARTES`, `DocLayout`). |

---

## Receita 12. Adicionar uma dica, selo ou cartão

Tudo é escrito no `.md`; não mexa em código. Sintaxes completas na Receita 8, "Elementos editoriais".

1. **Dica**: no ponto desejado do `.md`, deixe uma linha em branco e escreva `> [!TIP]` seguido de linhas começando com `>`. Alternativa: `:::dica` ... `:::`.
2. **Selo de conceito**: crie uma tabela cuja primeira coluna se chama `Conceito` e ponha só a letra (A, B, C, D, F, O ou I) em cada célula. Qualquer outra tabela fica normal.
3. **Cartões CR/CA/CP**: envolva em `::::cards` ... `::::` e escreva cada cartão como `:::card SIGLA | Subtítulo` ... `:::`. Cores: CR azul, CA verde, demais amarelo.
4. **Conferir**: `pnpm dev`, abra a rota da página (site) e `/print` (PDF). No PDF, a tabela de conceitos está na p.11 e os cartões na p.12 (Avaliação).

Se aparecer como texto cru ou citação comum, veja a Receita 11.

---

## Observações / pontos a verificar

- **Grade com dados ilustrativos (pendente).** `PdfGrade.vue` tem disciplinas e códigos inventados; substituir pelos reais.
- **Line endings.** O parser de frontmatter exige LF (Receita 8). Windows/Git com autocrlf podem reintroduzir CRLF.
- **`src/shared/config/routes.ts`** (`ROUTES`) não é importado por ninguém em `src/` e o comentário "o router.ts importa daqui" é falso. Código morto.
- **Partes cadastradas em vários lugares**: `PARTS` (`PdfMarkdownPages.vue`), `PARTES` (`PdfSumario.vue`), `SECTIONS` (`MarkdownPage.vue`), `NAV` (`Sidebar.vue`), links do `Header.vue`, além de listas `['ufabc','bct','bcc']`. Fácil esquecer um ao criar parte nova.
- **Menu lateral (`Sidebar.vue`) é manual** e já contém links com `#âncora` que dependem dos títulos dos `.md`; renomear um `##` quebra o link sem aviso.
- **Textos sem acento no PDF**: em `PdfMarkdownPages.vue`, `PARTS` usa "Ciencia", "Computacao" (sem acento) no subtítulo das partes, enquanto o sumário usa acento. Possível inconsistência de digitação.
- **Código possivelmente morto**: `PdfTexto.vue` (exportado em `src/pages/print/index.ts`, não usado por `PrintPage.vue`) e `PdfTabela.vue` (fora da composição).
- **`content/index.md`** tem `pdf: true`, mas é ignorado no PDF (a rota `/` é pulada) e não há rota que o renderize no site: a home usa `HomePage.vue`.
- **`pagedjs` e `playwright` são opcionais**: falha silenciosa na instalação deixa o `pnpm pdf` indisponível.
- **Possível duplicação**: `content/bcc/grade.md` tem `pdf: true` e `PdfGrade` também é renderizado ao final; confira no PDF se a grade aparece repetida.
