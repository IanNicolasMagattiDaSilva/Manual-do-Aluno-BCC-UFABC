import markdown from '@eslint/markdown'
import manual from './eslint-rules/manual-plugin.js'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'docs/**', 'pdf_diag/**', 'examples/**'] },
  {
    files: ['content/**/*.md'],
    plugins: { markdown, manual },
    language: 'markdown/gfm',
    languageOptions: { frontmatter: 'yaml' },
    rules: {
      // regras do nosso formato
      'manual/frontmatter':       'error',
      'manual/containers':        'error',
      'manual/callouts':          'error',
      'manual/internal-links':    'error',
      'manual/heading-structure': 'error',
      // regras gerais do @eslint/markdown
      'markdown/no-empty-links':        'error',
      'markdown/no-empty-images':       'error',
      'markdown/no-duplicate-headings': ['error', { checkSiblingsOnly: true }],
      'markdown/table-column-count':    'error',
    },
  },
]
