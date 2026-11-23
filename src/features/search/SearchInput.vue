<script setup lang="ts">
/**
 * SearchInput.vue — Campo de busca extraído do Header.
 * Recebe v-model, emite 'submit' quando o usuário pressiona Enter.
 *
 * A integração com o mecanismo de busca real fica em features/search;
 * este componente é só a UI.
 */

defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [query: string]
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('submit', (e.target as HTMLInputElement).value)
  }
}
</script>

<template>
  <label
    class="relative flex items-center gap-2 border border-border-strong px-3 h-11 min-w-[220px] box-border font-mono text-[13px] text-fg-muted"
  >
    <!-- Ícone de lupa -->
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      class="shrink-0 text-fg-muted"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>

    <!-- Label acessível (visualmente oculta) -->
    <span class="sr-only">Buscar no manual</span>

    <input
      type="search"
      :placeholder="placeholder ?? 'Buscar no manual'"
      :value="modelValue"
      class="border-0 outline-none font-[inherit] text-fg-default bg-transparent w-full"
      @input="onInput"
      @keydown="onKeydown"
    />

    <!-- Atalho de teclado (opcional, visível no header da home) -->
    <slot name="shortcut" />
  </label>
</template>
