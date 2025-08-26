<template>
  <nav class="flex items-center justify-center gap-2" role="navigation" aria-label="Paginación">
    <button
      class="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
      aria-label="Página anterior"
    >
      ‹
    </button>

    <button
      v-for="n in pages"
      :key="n"
      class="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100"
      :class="n === page ? 'bg-slate-900 text-white border-slate-900' : ''"
      @click="$emit('update:page', n)"
      :aria-current="n === page ? 'page' : false"
      :aria-label="`Ir a la página ${n}`"
    >
      {{ n }}
    </button>

    <button
      class="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
      aria-label="Página siguiente"
    >
      ›
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'  

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
const pages = computed(() => {
  const out = []
  for (let i = 1; i <= props.totalPages; i++) out.push(i)
  return out
})
</script>
