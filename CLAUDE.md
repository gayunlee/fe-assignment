# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This project uses **Feature-Sliced Design (FSD)** architecture with React + Vite + TypeScript.

### FSD Layer Structure (`src/`)

```
app/        → Application init, providers, router
pages/      → Route components (1:1 with URL)
widgets/    → Composite UI blocks (combine entities + features)
features/   → Write operations, mutations, business actions
entities/   → Read operations, domain models, queries
shared/     → Shared UI, utilities, configs
```

### Layer Import Rules

- Layers can only import from layers below them (app → pages → widgets → features → entities → shared)
- Within a slice: use **relative paths**
- Across slices: use **absolute paths** with `@/` alias
- Shared layer modules reference each other via **relative paths** to avoid circular imports

### Path Aliases (configured in tsconfig.json and vite.config.ts)

```
@/*          → src/*
@/app/*      → src/app/*
@/pages/*    → src/pages/*
@/widgets/*  → src/widgets/*
@/features/*  → src/features/*
@/entities/* → src/entities/*
@/shared/*   → src/shared/*
```

## Key Conventions

### API & React Query Pattern

- **Read APIs** go in `entities/{domain}/api/` with query hooks in `api/queries/`
- **Write APIs** go in `features/{domain}/api/` with mutation hooks
- Use `@lukemorales/query-key-factory` for query key management
- HTTP client: `ky` instance at `shared/api/client.ts` with token interceptor

### Segment Structure (within slices)

```
api/
  api/index.ts       → HTTP fetch functions
  queries/           → React Query hooks, queryKey.ts
model/
  types/             → TypeScript types
  hooks/             → Domain-related hooks
  schema/            → Validation schemas
  constants/         → Constants
ui/                  → UI components
lib/
  hooks/             → Non-domain hooks
  utils/             → Utility functions
```

### Public API Pattern

- Non-shared layers: export everything through slice `index.ts`
- Shared layer: import by segment (`@/shared/ui`, `@/shared/lib`, etc.)
- Cross-import between same-layer slices: use `@x` notation (`entities/A/@x/B.ts`)

### Hook Patterns (features layer)

- **State hooks** return `{ state: {...}, reducer: {...} }`
- **Action hooks** return `{ action: {...} }` for mutations

## Tech Stack

- React 18, TypeScript, React Router v7, TanStack Query v5
- Vite, Tailwind CSS v4, ky (HTTP client)
- Styling: `cn()` utility (clsx + tailwind-merge) at `shared/lib/utils/cn.ts`
