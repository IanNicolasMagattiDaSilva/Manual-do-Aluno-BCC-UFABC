
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/*
 * `base` controla o prefixo de todos os assets (JS, CSS, /guia.pdf, rotas).
 * - Em dev (`pnpm dev`) e preview local: '/' (padrão).
 * - No deploy pro GitHub Pages em project page (sem domínio custom), setamos
 *   VITE_BASE_URL='/Manual-do-Aluno-BCC-UFABC/' no workflow.
 * - Com domínio custom servindo na raiz, basta não setar a env.
 */
const BASE = process.env['VITE_BASE_URL'] ?? '/'

export default defineConfig({
  base: BASE,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@app':      fileURLToPath(new URL('./src/app',      import.meta.url)),
      '@pages':    fileURLToPath(new URL('./src/pages',    import.meta.url)),
      '@widgets':  fileURLToPath(new URL('./src/widgets',  import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@shared':   fileURLToPath(new URL('./src/shared',   import.meta.url)),
    },
  },
})
