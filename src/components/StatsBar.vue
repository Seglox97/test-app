<template>
  <section class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <p class="text-xs text-slate-500">Total de productos</p>
      <p class="text-2xl font-semibold text-slate-900">{{ total }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <p class="text-xs text-slate-500">Categorías únicas</p>
      <p class="text-2xl font-semibold text-slate-900">{{ categoriesCount }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <p class="text-xs text-slate-500">Precio promedio (USD)</p>
      <p class="text-2xl font-semibold text-slate-900">{{ avgUSD }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { formatUSD } from '../utils/format'

const props = defineProps({
  total: { type: Number, required: true },
  categoriesCount: { type: Number, required: true },
  averageUSD: { type: Number, required: true }
})

const avgUSD = computed(() => formatUSD(props.averageUSD))
</script>
