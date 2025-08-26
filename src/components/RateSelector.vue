<template>
  <div class="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm">
    <label for="rate-source" class="text-slate-600">Fuente dólar:</label>
    <select id="rate-source" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
      class="border rounded-lg px-3 py-2 bg-white">
      <option v-for="s in sources" :key="s" :value="s">
        {{ toLabel(s) }}
      </option>
    </select>
    <span v-if="updatedAt" class="text-xs text-slate-500">
      Última actualización: {{ new Date(updatedAt).toLocaleString() }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  sources: { type: Array, default: () => [] },
  modelValue: { type: String, default: 'oficial' },
  updatedAt: { type: String, default: null }
})
const emits = defineEmits(['update:modelValue'])
function toLabel(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>
