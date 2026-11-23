/**
 * types.ts — Tipos de Course, Grade e Coefficient.
 * Usados pela página de Avaliação e pelas páginas de Grade/Matriz.
 */

/** Conceito possível no sistema da UFABC */
export type GradeKey = 'A' | 'B' | 'C' | 'D' | 'F' | 'O' | 'I'

export interface Grade {
  k:      GradeKey
  status: 'Aprovado' | 'Reprovado' | 'Incompleto'
  d:      string    // descrição
  bg:     string    // cor de fundo do badge
  fg:     string    // cor do texto do badge
}

export interface Coefficient {
  /** Sigla: CR, CA, CP */
  k:    string
  name: string
  d:    string    // descrição
  /** Cor de destaque (border-top) */
  c:    string
}

export interface Course {
  /** Código da disciplina (ex: MCTA001-15) */
  code:    string
  name:    string
  credits: number
  /** Recomendação de quadrimestre (1-based) */
  term?:   number
}

/** Disciplina da Matriz Curricular BC&T */
export interface Discipline {
  /** Código oficial (ex: BCM0504-15, BIR0603-13) */
  codigo:        string
  nome:          string
  creditos:      number
  /** Quadrimestre recomendado (1-based, dentro do ano) */
  quadrimestre:  number
  /** Ano/ciclo na grade (1, 2 ou 3) */
  ano:           number
  /** Natureza da disciplina */
  natureza:      'Obrigatória' | 'Livre Escolha' | 'Opção Limitada'
}

/** Disciplina da Grade Curricular do BCC */
export interface BCCDiscipline {
  /** Código da disciplina (ex: MCTA001-15) — exibido em font-mono */
  code:    string
  name:    string
  credits: number
  /** Natureza: obrigatoria | opcao-limitada | livre */
  nature:  'obrigatoria' | 'opcao-limitada' | 'livre'
}

/** Coluna de quadrimestre na grade do BCC */
export interface BCCTerm {
  /** Número do quadrimestre (1-based, global na grade) */
  term:         number
  disciplines:  BCCDiscipline[]
  /** Total de créditos do quadrimestre */
  totalCredits: number
}

/** Versão do PPC (Projeto Pedagógico do Curso) */
export interface PPCVersion {
  /** Ex: "PPC 2011" */
  label: string
  /** Ano de vigência */
  year:  number
}

/** Diferença entre versões do PPC em um aspecto específico */
export interface PPCDifference {
  /** Aspecto comparado (ex: "Carga horária total") */
  aspect: string
  /** Mapa de rótulo da versão → valor para aquele aspecto */
  values: Record<string, string>
  /** Observação adicional (opcional) */
  note?:  string
}
