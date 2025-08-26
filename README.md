# Retail Dashboard (Venezuela) - Vue 3
Technical test project: a dashboard using **Vue 3 + Vite, Tailwind, Axios**, consuming **FakeStoreAPI** and **ve.dolarapi.com** for the USD→VES exchange rate.

## Requisitos
- Node 18+

## Instalación
```bash
npm install
npm run dev
```

## Architecture
- src/composables/useProducts.js - Data loading, filters, pagination, statistics, and LocalStorage persistence. Fetches the rate from https://ve.dolarapi.com/v1/dolares and allows choosing the source (oficial, paralelo, bitcoin).

- src/components/* - Decoupled UI components (StatsBar, FiltersBar, ProductCard, Pagination, RateSelector).

- src/utils/format.js - Utilities for formatting USD and VES with Venezuelan format (1,000.00 Bs).

## Features

- Product list (5 per page), with image, title, category, price in USD and VES (selectable rate).

- Client-side filters: category and price range (USD).

- Reactive statistics (based on filtered results): total, unique categories, average USD.

- Accessibility (labels, aria-* on pagination), responsive design, simple animation when changing pages.

- Persistence of filters, current page, and exchange rate source in LocalStorage.

## Notes APIs

- Products: `https://fakestoreapi.com/products`

- Categories: `https://fakestoreapi.com/products/categories`

- Rate: `https://ve.dolarapi.com/v1/dolares`

- The source (fuente) is chosen, and the promedio field is used as Bs/USD. fechaActualizacion is displayed.

## Technical Decisions
- **Composition API** for state and derived state (`computed`)..
- **Tailwind** for speed and visual consistency.
- Built-in **error handling** and **loading states**.
- Exchange rate source selector for transparency about the rate's origin.
