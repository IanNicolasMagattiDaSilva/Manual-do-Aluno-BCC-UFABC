/**
 * types.ts — Tipo Section, usado pela Sidebar e pelo sumário do PDF.
 */

export interface SectionItem {
  /** Título da página */
  t:     string
  /** URL da rota */
  href:  string
  /** Número de ordem/página (opcional) */
  n?:    string
}

export interface Section {
  /** Eyebrow label (ex: "Parte 1 · UFABC") */
  label: string
  /** Cor CSS do eyebrow label */
  color: string
  items: SectionItem[]
}
