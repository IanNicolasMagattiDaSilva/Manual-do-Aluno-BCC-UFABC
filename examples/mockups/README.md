# Mockups DC (Design Compiler)

Arquivos `.dc.html` originais do protótipo do Manual do Aluno BCC UFABC.

## Formato

Cada arquivo usa o runtime DC (Design Compiler) com:
- `<x-dc>` — componente raiz
- `<dc-import>` — importa outro componente
- `<sc-for list="{{arr}}" as="x">` — loop
- `<script type="text/x-dc" data-dc-script>` — lógica em `class Component extends DCLogic`
- `renderVals()` — retorna os valores interpolados no template
- `{{valor}}` — interpolação

## Componentes primitivos (já convertidos para Vue)

| Mockup             | Vue equivalente                              |
|--------------------|----------------------------------------------|
| `Logo.dc.html`     | `src/shared/ui/Logo/Logo.vue`                |
| `Wafer.dc.html`    | `src/shared/ui/Wafer/Wafer.vue`              |
| `Header.dc.html`   | `src/features/navigation/Header.vue`         |
| `Sidebar.dc.html`  | `src/features/navigation/Sidebar.vue`        |
| `Hero.dc.html`     | `src/widgets/hero/Hero.vue`                  |
| `PdfFolio.dc.html` | `src/features/pdf-export/PdfFolio.vue`       |

## Páginas do site (Fase 2a — pendente)

| Mockup              | Rota Vue                  |
|---------------------|---------------------------|
| `Main.dc.html`      | `/`                       |
| `Campi.dc.html`     | `/ufabc/campi`            |
| `Matricula.dc.html` | `/ufabc/matricula`        |
| `Pagina.dc.html`    | `/ufabc/avaliacao`        |
| `Projetos.dc.html`  | `/ufabc/projetos`         |
| `MatrizBCT.dc.html` | `/bct/matriz`             |
| `Grade.dc.html`     | `/bcc/grade`              |
| `PPC.dc.html`       | `/bcc/ppc`                |

## Layouts de PDF (Fase 2b — pendente)

| Mockup              | Componente Vue                            |
|---------------------|-------------------------------------------|
| `Capa.dc.html`      | `src/pages/print/PdfCapa.vue`             |
| `PdfParte.dc.html`  | `src/pages/print/PdfParte.vue`            |
| `PdfSumario.dc.html`| `src/pages/print/PdfSumario.vue`          |
| `PdfTexto.dc.html`  | `src/pages/print/PdfTexto.vue`            |
| `PdfTabela.dc.html` | `src/pages/print/PdfTabela.vue`           |
| `PdfGrade.dc.html`  | `src/pages/print/PdfGrade.vue`            |
