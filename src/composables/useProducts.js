import { ref, computed, watch } from 'vue'
import axios from 'axios'

// API endpoints
const PRODUCTS_URL = 'https://fakestoreapi.com/products'
const CATEGORIES_URL = 'https://fakestoreapi.com/products/categories'
const DOLLAR_URL = 'https://ve.dolarapi.com/v1/dolares' 

export function useProducts() {
  // state
  const products = ref([])
  const categories = ref([])

  // tasa
  const usdToVes = ref(null)
  const rateSources = ref([]) // ['oficial', 'paralelo', 'bitcoin']
  const selectedRateSource = ref(localStorage.getItem('retail.rateSource') || 'oficial')
  const rateUpdatedAt = ref(null)

  const loading = ref(true)
  const error = ref(null)

  // filters (persisted)
  const selectedCategory = ref(localStorage.getItem('retail.category') || 'Todas')
  const minPrice = ref(Number(localStorage.getItem('retail.minPrice')) || 0)
  const maxPrice = ref(Number(localStorage.getItem('retail.maxPrice')) || 0)

  // pagination
  const page = ref(Number(localStorage.getItem('retail.page')) || 1)
  const pageSize = 5

  const priceBounds = computed(() => {
    if (!products.value.length) return { min: 0, max: 0 }
    const prices = products.value.map(p => p.price)
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))
    return { min, max }
  })

  // Ensure min/max have defaults after load
  watch(priceBounds, (bounds) => {
    if (minPrice.value === 0 && maxPrice.value === 0) {
      minPrice.value = bounds.min
      maxPrice.value = bounds.max
    } else {
      // clamp
      if (minPrice.value < bounds.min) minPrice.value = bounds.min
      if (maxPrice.value > bounds.max) maxPrice.value = bounds.max
    }
  }, { immediate: true })

  // derived
  const filtered = computed(() => {
    let list = products.value
    if (selectedCategory.value && selectedCategory.value !== 'Todas') {
      list = list.filter(p => p.category === selectedCategory.value)
    }
    list = list.filter(p => p.price >= minPrice.value && p.price <= maxPrice.value)
    return list
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  // stats (based on filtered set)
  const totalProducts = computed(() => filtered.value.length)
  const uniqueCategoriesCount = computed(() => new Set(filtered.value.map(p => p.category)).size)
  const averageUSD = computed(() => {
    if (!filtered.value.length) return 0
    const sum = filtered.value.reduce((acc, p) => acc + Number(p.price || 0), 0)
    return sum / filtered.value.length
  })

  async function fetchRates() { // non-throwing; keeps products visible even if rate fails
    // Espera estructura: [{fuente, nombre, promedio, ...}, ...]
    const { data } = await axios.get(DOLLAR_URL, { timeout: 15000 })
    const sources = Array.isArray(data) ? data : []
    rateSources.value = sources.map(i => i.fuente)
    // Mantener selección si existe; si no, usar 'oficial' o la primera
    if (!rateSources.value.includes(selectedRateSource.value)) {
      selectedRateSource.value = rateSources.value.includes('oficial') ? 'oficial' : (rateSources.value[0] || 'oficial')
    }
    const chosen = sources.find(i => i.fuente === selectedRateSource.value)
    usdToVes.value = chosen?.promedio || null
    rateUpdatedAt.value = chosen?.fechaActualizacion || null
    if (!usdToVes.value || usdToVes.value <= 0) {
      console.warn('No se pudo obtener la tasa de cambio, se ocultará VES')
      usdToVes.value = null
    }
  }

  // actions
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(PRODUCTS_URL, { timeout: 15000 }),
        axios.get(CATEGORIES_URL, { timeout: 15000 }),
      ])
      products.value = Array.isArray(prodRes.data) ? prodRes.data : []
      categories.value = ['Todas', ...(Array.isArray(catRes.data) ? catRes.data : [])]
      console.log('products', products)
      try { await fetchRates() } catch (e) { console.warn('Rate fetch failed but continuing:', e) }
    } catch (e) {
      console.error(e)
      error.value = e?.message || 'Error cargando datos'
    } finally {
      loading.value = false
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
    page.value = 1
  }

  function setPriceRange(min, max) {
    minPrice.value = Number(min)
    maxPrice.value = Number(max)
    if (minPrice.value > maxPrice.value) {
      const t = minPrice.value
      minPrice.value = maxPrice.value
      maxPrice.value = t
    }
    page.value = 1
  }

  function goToPage(p) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }

  async function setRateSource(source) {
    selectedRateSource.value = source
    localStorage.setItem('retail.rateSource', source)
    try {
      try { await fetchRates() } catch (e) { console.warn('Rate fetch failed but continuing:', e) }
    } catch (e) {
      error.value = e?.message || 'Error actualizando tasa'
    }
  }

  // persist
  watch([selectedCategory, minPrice, maxPrice, page], ([c, min, max, p]) => {
    localStorage.setItem('retail.category', c)
    localStorage.setItem('retail.minPrice', String(min))
    localStorage.setItem('retail.maxPrice', String(max))
    localStorage.setItem('retail.page', String(p))
  })

  return {
    // state
    products, categories,
    usdToVes, rateSources, selectedRateSource, rateUpdatedAt,
    loading, error,
    // filters
    selectedCategory, minPrice, maxPrice, priceBounds,
    // pagination
    page, pageSize, totalPages, paginated,
    // stats
    totalProducts, uniqueCategoriesCount, averageUSD,
    // actions
    fetchAll, setCategory, setPriceRange, goToPage, setRateSource,
  }
}
