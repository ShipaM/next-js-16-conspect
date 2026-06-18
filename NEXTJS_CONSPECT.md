# Next.js — Конспект

> Версия документации: 16.x | Обновляется по мере изучения

---

## 1. App Router — Маршрутизация на основе файловой системы

Next.js использует **файловую систему как роутер**: папки = сегменты URL, файлы = UI для этих сегментов.

### 1.1 Структура папок

```
next-js-16-conspect/
├── src/
│   └── app/                  ← App Router живёт здесь
│       ├── layout.tsx         ← Root Layout (обязателен)
│       ├── page.tsx           ← Страница "/"
│       ├── globals.css
│       └── dashboard/
│           ├── layout.tsx     ← Nested Layout для /dashboard/*
│           └── page.tsx       ← Страница "/dashboard"
├── public/                    ← Статика (svg, png…)
└── next.config.js
```

> В этом проекте используется папка `src/` — опциональная, отделяет код от конфигов в корне.

---

### 1.2 Специальные файлы (routing files)

Каждый файл выполняет строго определённую роль. Роут становится публичным **только** при наличии `page.tsx` или `route.ts`.

| Файл | Назначение |
|---|---|
| `page.tsx` | Уникальный UI страницы, делает роут публичным |
| `layout.tsx` | Общий UI для сегмента и всех его потомков, **не перерендеривается** при навигации |
| `loading.tsx` | Skeleton/spinner — автоматически оборачивает страницу в `<Suspense>` |
| `error.tsx` | Error boundary для сегмента (должен быть `'use client'`) |
| `not-found.tsx` | UI для 404 внутри сегмента |
| `route.ts` | API endpoint (только `.ts`, без UI) |
| `template.tsx` | Как layout, но **перерендеривается** при каждой навигации |
| `default.tsx` | Fallback для параллельных роутов (`@slot`) |
| `global-error.tsx` | Error boundary для Root Layout |

---

### 1.3 Иерархия рендеринга компонентов

Внутри каждого сегмента компоненты оборачивают друг друга в строгом порядке:

```
layout.tsx
  └── template.tsx
        └── error.tsx  (error boundary)
              └── loading.tsx  (suspense boundary)
                    └── not-found.tsx
                          └── page.tsx
```

---

### 1.4 Вложенные роуты

Каждая папка = сегмент URL. Вложение папок = вложение сегментов.

```
app/
├── page.tsx              →  /
├── dashboard/
│   └── page.tsx          →  /dashboard      ← в нашем проекте
└── blog/
    ├── page.tsx          →  /blog
    └── authors/
        └── page.tsx      →  /blog/authors
```

Layouts наследуются: `app/layout.tsx` оборачивает **все** страницы, `app/dashboard/layout.tsx` — только `/dashboard` и вложенные в него роуты.

---

### 1.5 Layouts (макеты)

**Root Layout** (`app/layout.tsx`) — единственный обязательный файл, должен содержать `<html>` и `<body>`.

```tsx
// app/layout.tsx — из нашего проекта
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Nested Layout** — добавляется в любую подпапку. Оборачивает только страницы внутри этой папки.

В нашем проекте `dashboard/layout.tsx` реализует паттерн сайдбар + контент:

```tsx
// app/dashboard/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode; // сюда придёт dashboard/page.tsx или вложенный layout
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // flex-1 — растягивает layout на всю высоту, т.к. body в Root Layout является flex-col
    <div className="flex flex-row flex-1 ...">
      <aside className="w-1/5 ...">
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 ...">{children}</main>
    </div>
  );
}
```

**Почему `flex-1` работает:** Root Layout задаёт `<body className="min-h-full flex flex-col">`,
поэтому дочерний элемент с `flex-1` автоматически растягивается на всю оставшуюся высоту экрана.

**Цепочка растяжения:**
```
<html className="h-full">          ← фиксирует высоту на 100%
  <body className="flex flex-col"> ← вертикальный flex-контейнер
    <DashboardLayout className="flex-1"> ← занимает всё свободное пространство
```

Ключевые свойства layouts:
- **Сохраняют состояние** при переходе между дочерними страницами — сайдбар не перемонтируется
- **Не перерендериваются** — интерактивные элементы (форма, скролл) живут между навигациями
- Получают `children` — дочерний layout или page
- Типизация пропов: `type DashboardLayoutProps = { children: ReactNode }` — явная и переиспользуемая

---

### 1.6 Template (шаблон) — layout который перемонтируется

`template.tsx` выглядит как layout, но **создаётся заново при каждой навигации** — React полностью размонтирует и монтирует его.

В нашем проекте `dashboard/template.tsx` демонстрирует это поведение:

```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  const [text, setText] = useState(""); // ← сбрасывается при каждом переходе

  useEffect(() => {
    // ← срабатывает при каждой навигации на /dashboard/*
    console.log("Template: Mounting...(We have navigated to this page)");
  }, []);

  return (
    // animate-in — анимация входа работает при каждом переходе, т.к. компонент перемонтируется
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <input value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Text will be cleaned up on switch to another page..." />
      {children}
    </div>
  );
}
```

**Layout vs Template — когда что использовать:**

| | `layout.tsx` | `template.tsx` |
|---|---|---|
| Перемонтируется при навигации | Нет | **Да** |
| `useEffect` срабатывает при переходе | Нет | **Да** |
| Состояние (`useState`) сохраняется | **Да** | Нет — сбрасывается |
| Позиция в иерархии | Снаружи | Внутри layout, снаружи page |

**Используй `layout.tsx` когда:**
- Нужен общий UI который не должен прыгать при навигации (сайдбар, шапка)
- Нужно сохранять состояние — форма, позиция скролла, открытый аккордеон

**Используй `template.tsx` когда:**
- Нужна **анимация входа** на каждой странице (`animate-in`, `fade-in`) — как в нашем примере
- Нужно чтобы `useEffect` срабатывал при каждом переходе (аналитика, логи)
- Нужно **сбрасывать состояние** при смене страницы

**Цепочка рендеринга с обоими файлами:**
```
dashboard/layout.tsx   ← не перемонтируется, инпут сохраняет текст
  └── dashboard/template.tsx  ← перемонтируется, инпут сбрасывается
        └── dashboard/page.tsx
```

---

### 1.7 Loading (скелетон загрузки)

`loading.tsx` — это UI который показывается пока страница загружает данные. Next.js **автоматически** оборачивает `page.tsx` в `<Suspense>` и подставляет `loading.tsx` как fallback.

В нашем проекте `dashboard/loading.tsx` — скелетон из полосок с `animate-pulse`:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="animate-pulse flex space-x-4 p-4 bg-white rounded-lg w-full">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}
```

Чтобы продемонстрировать loading, `dashboard/page.tsx` сделан `async` с искусственной задержкой:

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // симуляция fetch

  return (
    <div className="p-4 bg-emerald-50 border-2 border-emerald-500">
      <h1 className="text-xl font-bold text-emerald-700">Dashboard page</h1>
    </div>
  );
}
```

**Когда отрабатывает `loading.tsx`:**

| Сценарий | Показывается? |
|---|---|
| Первый переход на `/dashboard` (страница `async`, ждёт данные) | **Да** |
| Переход через `<Link>` пока страница не готова | **Да** |
| Переход между `/dashboard/a` → `/dashboard/b` (если у обеих есть `loading.tsx`) | **Да** |
| Layout уже загружен, навигация на дочернюю страницу | **Да**, только в области `{children}` |

**Ключевые особенности:**
- Заменяет только `{children}` в layout — **сайдбар и layout остаются видимыми**
- `loading.tsx` не требует `'use client'` — это обычный Server Component
- Работает только с **async** страницами или страницами с `Suspense` внутри
- В иерархии рендеринга сидит **снаружи** `page.tsx`, **внутри** `template.tsx`:

```
layout.tsx       ← виден во время загрузки (сайдбар не пропадает)
  └── template.tsx
        └── loading.tsx  ← показывается как Suspense fallback
              └── page.tsx  ← рендерится когда async-данные готовы
```

---

### 1.8 Pages (страницы)

```tsx
// app/dashboard/page.tsx — из нашего проекта
export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // симуляция загрузки

  return (
    <div className="p-4 bg-emerald-50 border-2 border-emerald-500">
      <h1 className="text-xl font-bold text-emerald-700">Dashboard page</h1>
    </div>
  );
}
```

Страница рендерится внутри `{children}` своего ближайшего родительского layout — в данном случае внутри `<main>` из `dashboard/layout.tsx`.

Страница получает два специальных пропа (только в Server Components):

```tsx
// params — динамические сегменты
// searchParams — query string (?key=value)
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { filters } = await searchParams
}
```

> Использование `searchParams` переводит страницу в **динамический рендеринг**.

---

### 1.9 Error (граница ошибки)

`error.tsx` перехватывает исключения выброшенные внутри сегмента и показывает fallback UI вместо крэша всего приложения.

> **Обязательно `'use client'`** — React error boundary работает только как Client Component. Это одно из немногих мест где `'use client'` не опциональный, а обязательный.

В нашем проекте `dashboard/error.tsx`:

```tsx
"use client"; // ← ОБЯЗАТЕЛЬНО, иначе error boundary не работает

type DashboardErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardErrorPage({ error, reset }: DashboardErrorPageProps) {
  return (
    <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-lg">
      <h2 className="text-xl font-bold text-rose-700">Dashboard error page</h2>
      <p className="text-rose-600 text-sm mt-2">{error.message}</p>
      <p className="text-rose-600 text-sm mt-2">{error.digest}</p>
      <button onClick={() => reset()} className="...">Try again</button>
    </div>
  );
}
```

**Пропсы компонента:**

`error: Error & { digest?: string }` — стандартный объект ошибки JavaScript с одним дополнительным полем:

| Поле | Тип | Описание |
|---|---|---|
| `error.message` | `string` | Текст ошибки — показывается пользователю |
| `error.name` | `string` | Тип ошибки (`"Error"`, `"TypeError"` и т.д.) |
| `error.stack` | `string \| undefined` | Стек вызовов — только в development, в production не передаётся |
| `error.digest` | `string \| undefined` | Хэш серверной ошибки (только для ошибок в Server Components) |

> **Зачем `digest`:** когда ошибка происходит в Server Component, Next.js **не передаёт её детали клиенту** в production — это защита от утечки чувствительных данных. Вместо этого генерируется короткий хэш (`digest`), который можно найти в серверных логах и сопоставить с реальной ошибкой.

`reset: () => void` — функция повторного рендеринга сегмента. При вызове Next.js пытается заново отрендерить `page.tsx` без перезагрузки страницы. Именно её вешают на кнопку "Try again".

**Что перехватывает `error.tsx` и что нет:**

| Источник ошибки | Перехватывается? |
|---|---|
| `page.tsx` в том же сегменте | **Да** |
| Вложенные компоненты внутри `page.tsx` | **Да** |
| `layout.tsx` того же сегмента | **Нет** — нужен `error.tsx` в родительском сегменте |
| `loading.tsx` | **Нет** |
| `template.tsx` | **Нет** |

> Это важно: `layout.tsx` и `error.tsx` — братья, а не вложенные. `error.tsx` не может поймать ошибку своего `layout.tsx`. Для этого нужен `error.tsx` уровнем выше.

**Позиция в цепочке рендеринга:**
```
layout.tsx       ← ошибки здесь НЕ перехватываются этим error.tsx
  └── template.tsx
        └── error.tsx  ← перехватывает ошибки ниже (error boundary)
              └── loading.tsx
                    └── page.tsx  ← ошибки отсюда ПЕРЕХВАТЫВАЮТСЯ
```

---

### 1.10 Динамические сегменты

Имя папки в квадратных скобках создаёт динамический параметр:

| Паттерн папки | URL | `params` |
|---|---|---|
| `[slug]` | `/blog/hello` | `{ slug: 'hello' }` |
| `[...slug]` | `/shop/a/b/c` | `{ slug: ['a','b','c'] }` |
| `[[...slug]]` | `/docs` или `/docs/a/b` | `{}` или `{ slug: ['a','b'] }` |

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

---

### 1.11 Route Groups — организация без влияния на URL

Папка в круглых скобках `(name)` **не попадает в URL**, только организует файлы:

```
app/
├── (marketing)/
│   ├── layout.tsx        ← layout только для маркетинга
│   └── page.tsx          →  /
├── (shop)/
│   ├── layout.tsx        ← layout только для шопа
│   └── cart/
│       └── page.tsx      →  /cart
```

Применения:
- Разные layouts для разных секций при одном уровне вложенности
- Несколько Root Layouts (убрать `app/layout.tsx`, добавить `layout.tsx` в каждую группу)
- Применить `loading.tsx` только к конкретному роуту

---

### 1.12 Приватные папки

Префикс `_` исключает папку из роутинга полностью:

```
app/
└── dashboard/
    ├── page.tsx
    └── _components/      ← не роутится, безопасное место для UI-компонентов
        └── Chart.tsx
```

---

### 1.13 Навигация — компонент `<Link>`

`<Link>` расширяет `<a>`, добавляет клиентскую навигацию и **prefetching** (страница предзагружается при появлении ссылки во viewport):

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Главная</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  )
}
```

В нашем проекте `<Link>` используется в `dashboard/layout.tsx` внутри сайдбара — это правильный паттерн: навигация живёт в layout, а не в page, поэтому не перемонтируется при переходах между `/dashboard/*` страницами.

Для программной навигации в Client Components — хук `useRouter`:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function Button() {
  const router = useRouter()
  return <button onClick={() => router.push('/dashboard')}>Go</button>
}
```

---

### 1.14 Metadata (метаданные)

Экспортируется из `layout.tsx` или `page.tsx`:

```tsx
// app/layout.tsx — из нашего проекта
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}
```

---

### 1.15 Dark Mode с Tailwind

Next.js + Tailwind поддерживают dark mode через префикс `dark:` — стили применяются когда на `<html>` есть класс `dark` (или через медиа-запрос, зависит от настройки `tailwind.config`).

```tsx
// Каждый класс дублируется для тёмной темы через dark:
<aside className="bg-blue-50 dark:bg-zinc-900">
  <Link className="text-zinc-400 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-sky-400">
    Dashboard
  </Link>
</aside>
```

В `dashboard/layout.tsx` используется для:
- Фон сайдбара: `bg-blue-50` → `dark:bg-zinc-900`
- Фон контента: без фона → `dark:bg-zinc-800` (чуть светлее сайдбара, чтобы не сливались)
- Ссылки: `text-zinc-400` → `dark:text-zinc-300` (ярче для читаемости на тёмном)
- Hover ссылок: `hover:text-blue-600` → `dark:hover:text-sky-400`

---

### 1.16 Текущая структура проекта

```
src/app/
├── layout.tsx          — Root Layout: html+body, Geist-шрифты, flex flex-col
├── page.tsx            — Стартовая страница "/"
├── globals.css         — Глобальные стили
└── dashboard/
    ├── layout.tsx      — Nested Layout: сайдбар + main, инпут сохраняет состояние
    ├── template.tsx    — Template: анимация входа, инпут сбрасывается при навигации
    ├── loading.tsx     — Скелетон: показывается пока page.tsx ждёт async-данные
    ├── error.tsx       — Error boundary: перехватывает ошибки page.tsx, обязательно 'use client'
    └── page.tsx        — Страница "/dashboard", async с задержкой 2s
```

**Цепочка рендеринга для `/dashboard`:**
```
app/layout.tsx                    ← Root: не перемонтируется никогда
  └── dashboard/layout.tsx            ← сайдбар остаётся при загрузке и ошибках
        └── dashboard/template.tsx        ← перемонтируется при каждом переходе
              └── dashboard/error.tsx         ← ловит ошибки из page.tsx
                    └── dashboard/loading.tsx      ← fallback пока page грузится
                          └── dashboard/page.tsx       ← рендерится после 2s
```

---

*Следующие темы для изучения: Server vs Client Components, Data Fetching, Caching*
