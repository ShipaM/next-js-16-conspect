# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a **learning/conspect repository** for Next.js 16. The codebase is intentionally demonstrative — each feature area is a working example of a specific Next.js concept. `NEXTJS_CONSPECT.md` is the companion notes file; update it only when explicitly asked.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
```

No test runner, linter, or formatter is configured.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `babel-plugin-react-compiler`

**Source layout:** All app code lives under `src/app/`. Shared server-only utilities live in `lib/`.

### Key patterns demonstrated

| Area | Location |
|---|---|
| Parallel routes + intercepting routes (modal) | `src/app/@modal/` + `src/app/photo/[id]/` |
| Route groups (shared auth layout, no URL segment) | `src/app/(auth)/` |
| Nested dashboard layout with sidebar | `src/app/dashboard/` |
| Catch-all and optional catch-all segments | `src/app/shop/[...slug]/` · `src/app/store/[[...slug]]/` |
| `loading.tsx` / `error.tsx` / `template.tsx` | `src/app/dashboard/` |
| Server Component fetching with `fetch` cache options | `src/app/cache/page.tsx` |
| Server-only DB module (`server-only` package) | `lib/db.ts` |
| Mixing Server + Client Components | `src/app/dashboard/users/page.tsx` (server) + `src/app/_components/wink-button.tsx` (`'use client'`) |

### Root layout slots

`src/app/layout.tsx` accepts two slots: `children` (main content) and `modal` (parallel route `@modal`). The modal slot renders intercepted photo routes as overlays while keeping the address bar URL.

### `lib/db.ts`

Marked `server-only` — will throw at build time if imported from a Client Component. Contains a mock user dataset with an artificial 500 ms delay to simulate async data fetching.

### Path alias

`@/` resolves to `src/` (configured via TypeScript/Next.js defaults).
