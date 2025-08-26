<template>
  <section class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="flex flex-col gap-1">
      <label for="category" class="text-xs text-slate-500">Categoría</label>
      <select id="category" v-model="localCategory"
        class="border rounded-lg px-3 py-2 bg-white">
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-xs text-slate-500">Precio mínimo (USD)</label>
      <input type="number" v-model.number="localMin" :min="bounds.min" :max="bounds.max"
        class="border rounded-lg px-3 py-2" />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-xs text-slate-500">Precio máximo (USD)</label>
      <input type="number" v-model.number="localMax" :min="bounds.min" :max="bounds.max"
        class="border rounded-lg px-3 py-2" />
    </div>

    <div class="md:col-span-3 flex items-center gap-2 justify-end">
      <button @click="apply"
        class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]">
        Aplicar filtros
      </button>
      <button @click="reset"
        class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
        Limpiar
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },
  selectedCategory: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  bounds: { type: Object, required: true },
})

const emits = defineEmits(['update:category', 'update:price'])

const localCategory = ref(props.selectedCategory)
const localMin = ref(props.minPrice)
const localMax = ref(props.maxPrice)

watch(() => props.selectedCategory, v => { localCategory.value = v })
watch(() => props.minPrice, v => { localMin.value = v })
watch(() => props.maxPrice, v => { localMax.value = v })

function apply() {
  emits('update:category', localCategory.value)
  emits('update:price', { min: localMin.value, max: localMax.value })
}

function reset() {
  localCategory.value = 'Todas'
  localMin.value = props.bounds.min
  localMax.value = props.bounds.max
  apply()
}
</script>
