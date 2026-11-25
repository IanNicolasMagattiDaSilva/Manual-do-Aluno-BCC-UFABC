<script setup lang="ts">
/**
 * ProjetosPage.vue — Projetos e oportunidades.
 * Rota: /ufabc/projetos
 *
 * Grid de cards de iniciativas disponíveis ao aluno UFABC:
 * monitoria, PIBIC, extensão, empresa júnior, PET, entre outros.
 */

import DocLayout from '../_layouts/DocLayout.vue'

interface Projeto {
  titulo:    string
  eyebrow:   string
  descricao: string
  /** Tailwind class para a borda superior colorida do card */
  acento:    string
  /** Rota interna opcional (RouterLink) */
  link?:     string
}

const PROJETOS: Projeto[] = [
  {
    titulo:    'Monitoria',
    eyebrow:   'Ensino',
    descricao:
      'Monitores auxiliam professores em disciplinas com alta carga de exercícios. ' +
      'Seleção semestral aberta a qualquer aluno com bom desempenho na matéria. ' +
      'Pode ser remunerada (bolsa) ou voluntária.',
    acento: 'border-t-brand-azul',
  },
  {
    titulo:    'PIBIC / PIBITI',
    eyebrow:   'Iniciação Científica',
    descricao:
      'Programa de Iniciação Científica (PIBIC) e Tecnológica (PIBITI) financiado ' +
      'pelo CNPq e pela UFABC. Editais anuais; exige orientador docente e plano de ' +
      'trabalho com até 20 h/semana de dedicação.',
    acento: 'border-t-brand-verde',
  },
  {
    titulo:    'Extensão Universitária',
    eyebrow:   'Comunidade',
    descricao:
      'Projetos que aproximam a universidade da sociedade local. Podem ser ' +
      'contabilizados como créditos de Livre Escolha. Editais semestrais ' +
      'com e sem bolsa.',
    acento: 'border-t-brand-amarelo',
  },
  {
    titulo:    'Empresa Júnior',
    eyebrow:   'Empreendedorismo',
    descricao:
      'A InovaJr UFABC oferece consultoria em TI e engenharia conduzida por alunos. ' +
      'Desenvolvimento de projetos reais para clientes externos, com gestão ' +
      'e execução totalmente discente.',
    acento: 'border-t-brand-azul-claro',
  },
  {
    titulo:    'PET',
    eyebrow:   'Tutoria',
    descricao:
      'O Programa de Educação Tutorial (PET) reúne grupos que desenvolvem ' +
      'atividades de ensino, pesquisa e extensão de forma integrada, sob orientação ' +
      'de um tutor docente. Bolsas MEC para membros selecionados.',
    acento: 'border-t-brand-azul',
  },
  {
    titulo:    'Estágio',
    eyebrow:   'Mercado de Trabalho',
    descricao:
      'Estágios curriculares e não-curriculares. A UFABC mantém parceria com ' +
      'plataformas de vagas e oferece suporte jurídico para formalização de ' +
      'contratos via COSEST.',
    acento: 'border-t-brand-verde',
  },
  {
    titulo:    'Atlética e Ligas Acadêmicas',
    eyebrow:   'Vida Universitária',
    descricao:
      'Diversas organizações estudantis atuam no campus: Atlética, Centro ' +
      'Acadêmico, grupos culturais e ligas acadêmicas multidisciplinares. ' +
      'Participação voluntária, sem bolsa.',
    acento: 'border-t-brand-amarelo',
  },
  {
    titulo:    'PIVIC',
    eyebrow:   'Iniciação Científica',
    descricao:
      'Modalidade voluntária do PIBIC, sem bolsa. Permite participar de projetos ' +
      'de pesquisa com as mesmas atividades e certificação — boa porta de entrada ' +
      'para quem busca um orientador.',
    acento: 'border-t-brand-azul-escuro',
  },
]
</script>

<template>
  <DocLayout
    title="Projetos e oportunidades"
    section="ufabc"
    parte="Parte 1 · UFABC"
    tema="amarelo"
  >
    <!-- Breadcrumb -->
    <p class="m-0 mb-6 font-mono text-[13px] text-fg-muted">
      <RouterLink to="/" class="text-fg-muted no-underline hover:text-fg-default">Início</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink to="/ufabc/campi" class="text-fg-muted no-underline hover:text-fg-default">UFABC</RouterLink>
      <span aria-hidden="true"> / </span>
      <span class="text-fg-default">Projetos e oportunidades</span>
    </p>

    <!-- Lead -->
    <p class="mt-0 mb-10 text-[19px] text-fg-strong leading-[1.7]">
      A UFABC oferece diversas formas de engajamento além das disciplinas obrigatórias.
      Conhecer as oportunidades cedo é a melhor forma de enriquecer a trajetória acadêmica
      e profissional.
    </p>

    <!-- Grid de cards -->
    <h2
      id="iniciativas"
      class="mt-0 mb-6 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Iniciativas
    </h2>

    <section aria-label="Iniciativas e oportunidades">
      <ul class="list-none m-0 p-0 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        <template v-for="proj in PROJETOS" :key="proj.titulo">
          <li
            class="bg-bg-surface border border-border-subtle rounded-lg border-t-[3px] flex flex-col gap-3 p-6"
            :class="proj.acento"
          >
            <!-- Eyebrow -->
            <p class="m-0 font-mono text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
              {{ proj.eyebrow }}
            </p>

            <!-- Título -->
            <h3 class="m-0 font-display font-normal text-[22px] leading-tight uppercase text-fg-default">
              {{ proj.titulo }}
            </h3>

            <!-- Descrição -->
            <p class="m-0 text-[15px] text-fg-strong leading-[1.65] flex-1">
              {{ proj.descricao }}
            </p>

            <!-- Link opcional -->
            <RouterLink
              v-if="proj.link"
              :to="proj.link"
              class="mt-2 self-start font-mono text-[12px] font-bold tracking-[2px] uppercase text-brand-azul no-underline border-b border-brand-azul pb-px hover:text-brand-azul-escuro hover:border-brand-azul-escuro"
            >
              Saiba mais →
            </RouterLink>
          </li>
        </template>
      </ul>
    </section>

    <!-- Como participar -->
    <h2
      id="como-participar"
      class="mt-14 mb-4 font-display font-normal text-[34px] uppercase tracking-[0.3px] text-fg-default"
    >
      Como participar
    </h2>
    <p class="mt-0 mb-6 text-fg-strong leading-[1.7]">
      A maioria das oportunidades é divulgada pelo portal da UFABC, pelas listas de
      e-mail das turmas e pelos murais dos campi. Fique atento às datas de cada edital —
      os prazos costumam ser curtos.
    </p>

    <!-- Callout dica -->
    <aside
      aria-label="Dica"
      class="mt-2 p-5 bg-bg-azul-soft border-l-4 border-brand-azul rounded-r-lg"
    >
      <p class="m-0 font-mono text-[11px] font-bold tracking-[3px] uppercase text-brand-azul-escuro mb-2">
        Dica
      </p>
      <p class="m-0 text-[15px] text-fg-strong leading-[1.65]">
        Independentemente do período, vale conversar com professores cujas pesquisas
        despiertem interesse — muitos orientadores aceitam alunos fora dos editais
        formais.
      </p>
    </aside>
  </DocLayout>
</template>
