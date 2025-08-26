<template>
  <article class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
    <img
      :src="product.image"
      :alt="product.title"
      loading="lazy"
      class="w-full h-48 object-contain bg-slate-50"
    />
    <div class="p-4 space-y-2">
      <h3 class="text-slate-800 font-semibold line-clamp-2" :title="product.title">
        {{ product.title }}
      </h3>
      <p class="text-sm text-slate-500 capitalize">Categoría: {{ product.category }}</p>
      <div class="flex items-baseline justify-between pt-2">
        <span class="text-base font-semibold text-slate-900">{{ usd }}</span>
        <span class="text-xs text-slate-600">{{ ves }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatUSD, formatVES } from '../utils/format'

const props = defineProps({
  product: { type: Object, required: true },
  rate: { type: Number, required: false, default: null }
})

const usd = computed(() => formatUSD(props.product.price))
const ves = computed(() => props.rate ? formatVES(props.product.price * props.rate) : '—')
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
