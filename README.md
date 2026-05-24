# Catálogo Digital — WhatsApp Product Catalog

A social-media-optimized digital product catalog built for sharing via WhatsApp.
Browse products, filter by category, search by name, and consult via WhatsApp with
one tap. PWA-ready with offline support.

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Framework   | Next.js 16 (App Router, SSG)                  |
| Runtime     | React 19                                      |
| Language    | TypeScript (strict)                           |
| Styling     | Tailwind CSS 4                                |
| State       | Zustand 5                                     |
| Validation  | Zod 4                                         |
| Testing     | Vitest 4 + React Testing Library + Playwright |
| PWA         | Serwist 9                                     |
| Pkg Manager | pnpm                                          |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

## Scripts

| Command                     | Description              |
| --------------------------- | ------------------------ |
| `pnpm dev`                  | Next.js dev server       |
| `pnpm build`                | Production build         |
| `pnpm start`                | Start production server  |
| `pnpm lint`                 | Run ESLint               |
| `pnpm tsc --noEmit`         | TypeScript check         |
| `pnpm vitest run`           | Unit + integration tests |
| `pnpm exec playwright test` | E2E tests (headless)     |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Inter font, metadata, PWA banner)
│   ├── page.tsx            # Homepage (SSG catalog grid)
│   ├── [productId]/        # Product detail page (SSG)
│   │   ├── page.tsx        # Metadata, JSON-LD, gallery, WhatsApp CTA
│   │   └── opengraph-image.tsx  # Dynamic OG images (1200×630)
│   ├── categories/[category]/page.tsx  # Category pages (SSG)
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # Robots.txt config
│   ├── manifest.ts         # PWA manifest
│   └── sw.ts              # Service worker (Serwist)
├── components/             # Reusable UI components
│   ├── product-card.tsx    # Product card (server)
│   ├── product-grid.tsx    # Product grid + search + filters (client)
│   ├── product-gallery.tsx # Image carousel (client)
│   ├── search-bar.tsx      # Search input (client)
│   ├── category-filter.tsx # Category pills (client)
│   ├── whatsapp-cta.tsx    # WhatsApp consult button (client)
│   └── install-banner.tsx  # PWA install prompt (client)
├── lib/
│   ├── schemas.ts          # Zod schemas (Product + Catalog)
│   ├── store.ts            # Zustand catalog store
│   ├── jsonld.ts           # JSON-LD Product schema generator
│   ├── data/
│   │   ├── products.ts     # Sample product data (7 products, 4 categories)
│   │   └── catalog.ts      # Catalog query functions
│   ├── sharing/
│   │   ├── whatsapp-url.ts # WhatsApp deep-link builder
│   │   └── contact-fallback.ts # Contact priority resolver
│   └── og/
│       └── fallback.ts     # OG image fallback generator
└── __tests__/              # Vitest tests (TDD, 184 tests)
```

## Features

- **Catalog browsing**: Responsive grid (2/3/4 cols), search (diacritic-insensitive), category filtering
- **Product detail**: Image gallery, OG metadata, JSON-LD structured data, WhatsApp CTA
- **SEO**: OpenGraph tags, Twitter cards, sitemap, canonical URLs, dynamic OG images
- **PWA**: Manifest, service worker (Serwist), offline browsing, install banner
- **Accessibility**: ARIA labels, heading hierarchy, touch targets ≥44px, keyboard navigation

## Environment Variables

| Variable                       | Description               | Default               |
| ------------------------------ | ------------------------- | --------------------- |
| `NEXT_PUBLIC_BASE_URL`         | Base URL for OG/canonical | `https://catalog.com` |
| `NEXT_PUBLIC_DEFAULT_WHATSAPP` | Fallback WhatsApp number  | —                     |

## License

MIT
