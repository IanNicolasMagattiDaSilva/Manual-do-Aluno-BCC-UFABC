/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.css'
declare module '*.md'

declare module 'pagedjs' {
  export class Previewer {
    constructor()
    preview(content: Element, stylesheets: string[], renderTo: Element): Promise<unknown>
  }
}
