<template>
  <main class="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Tablero de Control - Retail (VE)</h1>
      <p class="text-slate-600 text-sm">Consumo de FakeStoreAPI y tasa (ve.dolarapi.com). Precios en USD y VES.</p>
    </header>

    <!-- States -->
    <section v-if="loading" class="text-center py-20">
      <p class="text-slate-500">Cargando datos...</p>
    </section>
    <section v-else-if="error" class="text-center py-10">
      <p class="text-red-600 font-medium">Ocurrió un error: {{ error }}</p>
      <button @click="fetchAll" class="mt-4 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
        Reintentar
      </button>
    </section>

    <section v-else class="space-y-6">
      <!-- Stats -->
      <StatsBar
        :total="totalProducts"
        :categories-count="uniqueCategoriesCount"
        :average-u-s-d="averageUSD"
      />

      <!-- Filters -->
      <FiltersBar
        :categories="categories"
        :selected-category="selectedCategory"
        :min-price="minPrice"
        :max-price="maxPrice"
        :bounds="priceBounds"
        @update:category="setCategory"
        @update:price="({min, max}) => setPriceRange(min, max)"
      />

      <!-- Exchange rate selection -->
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="text-xs text-slate-500">
          Tasa de cambio ({{ selectedRateSource }}): <span class="font-semibold">{{ usdToVes?.toFixed(4) }}</span> Bs/USD
        </div>
        <RateSelector
          :sources="rateSources"
          v-model="selectedRateSource"
          :updated-at="rateUpdatedAt"
          @update:modelValue="(s) => setRateSource(s)"
        />
      </div>

      <!-- Grid -->
      <Transition name="page-fade" mode="out-in">
        <section :key="page" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard
            v-for="p in paginated"
            :key="p.id"
            :product="p"
            :rate="usdToVes"
          />
        </section>
      </Transition>

      <!-- Pagination -->
      <div class="pt-4">
        <Pagination
          :page="page"
          :total-pages="totalPages"
          @update:page="goToPage"
        />
      </div>
    </section>

    <footer class="text-xs text-slate-400 pt-8 pb-4">
      By. Seglox97 - 2025
    </footer>
  </main>
</template>

<script setup>
import StatsBar from './components/StatsBar.vue'
import FiltersBar from './components/FiltersBar.vue'
import ProductCard from './components/ProductCard.vue'
import Pagination from './components/Pagination.vue'
import RateSelector from './components/RateSelector.vue'

import { useProducts } from './composables/useProducts'

const {
  // state
  products, categories, usdToVes, loading, error,
  // filters
  selectedCategory, minPrice, maxPrice, priceBounds,
  // pagination
  page, totalPages, paginated,
  // stats
  totalProducts, uniqueCategoriesCount, averageUSD,
  // rates
  rateSources, selectedRateSource, rateUpdatedAt,
  // actions
  fetchAll, setCategory, setPriceRange, goToPage, setRateSource,
} = useProducts()

fetchAll()
</script>
