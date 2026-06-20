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

### 1.10 Not Found (страница 404)

`not-found.tsx` — специальный файл который показывается когда роут не существует или когда вручную вызвана функция `notFound()`.

**Два способа попасть на not-found страницу:**

**1. Автоматически** — когда пользователь переходит по URL которого не существует в файловой системе (`/blabla`, `/dashboard/xyz` и т.д.). Next.js сам рендерит ближайший `not-found.tsx`.

**2. Программно через `notFound()`** — вызывается внутри Server Component когда данные не найдены. Например, загрузили пользователя по ID, а он `null`:

```tsx
// app/dashboard/settings/page.tsx
import { notFound } from "next/navigation";

export default function DashboardSettingsPage() {
  const data = null; // представим что fetch вернул null

  if (!data) notFound(); // ← бросает специальное исключение, Next.js его перехватывает
                         //   и показывает ближайший not-found.tsx

  return <div>Settings</div>;
}
```

> `notFound()` работает как `throw` — код после него не выполняется. Под капотом он бросает специальный объект ошибки, который Next.js отлавливает и направляет в `not-found.tsx`.

**Где размещать `not-found.tsx`:**

| Расположение | Когда срабатывает |
|---|---|
| `app/not-found.tsx` | Глобальный 404 для всего приложения — наш файл |
| `app/dashboard/not-found.tsx` | Только для `/dashboard/*` роутов |
| `app/blog/[slug]/not-found.tsx` | Только когда конкретный slug не найден |

Next.js ищет ближайший `not-found.tsx` **вверх по дереву** от места вызова `notFound()`. Если не нашёл — показывает дефолтный Next.js 404.

**Отличие от `error.tsx`:**

| | `not-found.tsx` | `error.tsx` |
|---|---|---|
| Причина | URL не существует / данные не найдены | Исключение в `page.tsx` |
| Триггер | Авто (неверный URL) или `notFound()` | `throw new Error(...)` |
| `'use client'` | Не нужен | **Обязателен** |
| Пропсы | Нет | `error`, `reset` |

---

### 1.11 Динамические роуты

---

#### 1.11.1 Одиночный динамический сегмент `[slug]`

Папка в квадратных скобках создаёт параметр — одно значение из URL:

```
app/blog/[slug]/page.tsx

/blog/hello-world  →  params.slug = "hello-world"
/blog/next-js-15   →  params.slug = "next-js-15"
/blog              →  404 (сегмент обязателен)
```

```tsx
// app/blog/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> }

export default async function BlogPost({ params }: Props) {
  const { slug } = await params  // params — всегда Promise в Next.js 15+
  return <h1>{slug}</h1>
}
```

> `params` — это `Promise`, его нужно `await`. Это изменение Next.js 15 — раньше params был синхронным объектом.

---

#### 1.11.2 Обязательный catch-all `[...slug]`

Три точки внутри скобок — `params.slug` становится массивом `string[]`. Матчит **один и более** сегментов, базовый URL без сегментов даёт 404.

В проекте: `app/shop/[...slug]/page.tsx`

```
/shop                          →  404 (нет сегментов — не матчит)
/shop/clothing                 →  slug = ["clothing"]
/shop/clothing/adidas          →  slug = ["clothing", "adidas"]
/shop/clothing/adidas/tracksuit →  slug = ["clothing", "adidas", "tracksuit"]
```

```tsx
// app/shop/[...slug]/page.tsx
type ShopPageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params  // slug: string[] — всегда массив, никогда undefined

  // Деструктуризация массива — удобный способ достать сегменты по позиции
  const [category, brand, model] = slug
  // /shop/clothing/adidas/tracksuit → category="clothing", brand="adidas", model="tracksuit"
  // /shop/clothing                  → category="clothing", brand=undefined, model=undefined

  return (
    <nav>
      <span>Shop</span>
      {slug.map((item, index) => (      // безопасно — slug всегда массив
        <span key={index}>/ {item}</span>
      ))}
    </nav>
  )
}
```

---

#### 1.11.3 Опциональный catch-all `[[...slug]]`

Двойные квадратные скобки — матчит **ноль и более** сегментов. Базовый URL тоже работает, но `slug` приходит как `undefined`.

В проекте: `app/store/[[...slug]]/page.tsx`

```
/store                          →  slug = undefined
/store/clothing                 →  slug = ["clothing"]
/store/clothing/adidas          →  slug = ["clothing", "adidas"]
/store/clothing/adidas/tracksuit →  slug = ["clothing", "adidas", "tracksuit"]
```

```tsx
// app/store/[[...slug]]/page.tsx
type StorePageProps = {
  params: Promise<{ slug: string[] }>  // типизация та же, но реально может прийти undefined
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params

  // ВАЖНО: при /store — slug равен undefined, нельзя сразу деструктурировать
  const currentSlug = slug ?? []   // ?? — nullish coalescing, заменяет только null/undefined
  //                         ↑ не использовать || "", т.к. строка не имеет .map()

  const [category, brand, model] = currentSlug

  return (
    <div>
      {!category && <p>Добро пожаловать — выберите категорию</p>}
      {category && <p>Категория: {category}</p>}

      {currentSlug.map((item, index) => (    // currentSlug — всегда массив, безопасно
        <span key={index}>/ {item}</span>
      ))}
    </div>
  )
}
```

**`??` vs `||` — важное отличие:**
```ts
slug ?? []   // заменяет только null и undefined → правильно
slug || []   // заменяет null, undefined, "", 0, false → может сломать непустые строки
```

---

#### 1.11.4 Сравнительная таблица всех вариантов

| Паттерн | Пример папки | `/store` | `/store/a` | `/store/a/b` | `slug` тип |
|---|---|---|---|---|---|
| `[slug]` | `[id]` | 404 | ✓ `"a"` | 404 | `string` |
| `[...slug]` | `[...slug]` | 404 | ✓ `["a"]` | ✓ `["a","b"]` | `string[]` |
| `[[...slug]]` | `[[...slug]]` | ✓ `undefined` | ✓ `["a"]` | ✓ `["a","b"]` | `string[] \| undefined` |

---

#### 1.11.5 URL-кодирование в сегментах

Next.js автоматически декодирует URL-encoded символы в `params`:

```
/shop/clothing/%20adidas/tracksuit
                ↑
         %20 = пробел (space)

params.slug = ["clothing", " adidas", "tracksuit"]
//                          ↑ пробел сохраняется
```

Поэтому при выводе стоит делать `.trim()`:
```tsx
{slug.map(item => <span>{item.trim()}</span>)}
```

---

#### 1.11.6 Текущая структура проекта

```
app/
├── shop/
│   └── [...slug]/          ← обязательный catch-all
│       └── page.tsx        →  /shop/x, /shop/x/y, НО не /shop
└── store/
    └── [[...slug]]/        ← опциональный catch-all
        └── page.tsx        →  /store, /store/x, /store/x/y
```

---

### 1.12 Route Groups

Папка в круглых скобках `(name)` **не попадает в URL** — используется только для организации файлов и применения общего layout к подмножеству роутов.

```
app/(auth)/login/page.tsx   →   /login       (не /(auth)/login)
app/(auth)/register/page.tsx →  /register
```

---

#### 1.12.1 Главный сценарий — разный layout для разных секций

В проекте группа `(auth)` объединяет `/login` и `/register` под одним layout — центрированная карточка на тёмном фоне. Dashboard при этом имеет совершенно другой layout (сайдбар + main).

```
src/app/
├── layout.tsx              ← Root Layout, оборачивает всё
├── (auth)/
│   ├── layout.tsx          ← Auth Layout: центрированная карточка с градиентом
│   ├── login/
│   │   └── page.tsx        →  /login
│   └── register/
│       └── page.tsx        →  /register
└── dashboard/
    ├── layout.tsx          ← Dashboard Layout: сайдбар + main
    └── page.tsx            →  /dashboard
```

**Цепочка рендеринга для `/login`:**
```
app/layout.tsx          ← Root (всегда)
  └── (auth)/layout.tsx ← Auth layout (только для /login и /register)
        └── (auth)/login/page.tsx
```

**Цепочка рендеринга для `/dashboard`:**
```
app/layout.tsx              ← Root (всегда)
  └── dashboard/layout.tsx  ← Dashboard layout (только для /dashboard/*)
        └── dashboard/page.tsx
```

Auth layout из проекта — полноэкранный центрированный вид, применяется только к страницам внутри `(auth)`:

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 ...">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl ...">
        <header className="text-center mb-10">
          <h2>Welcome back</h2>
          <p>Enter your details to continue</p>
        </header>

        {children}  {/* сюда придёт login/page.tsx или register/page.tsx */}

        <footer>Secure Authentication System</footer>
      </div>
    </div>
  )
}
```

---

#### 1.12.2 Другие сценарии применения

**Несколько Root Layouts** — убрать `app/layout.tsx`, добавить свой `layout.tsx` в каждую группу. Каждая группа получает свой `<html>` и `<body>`:

```
app/
├── (marketing)/
│   ├── layout.tsx   ← свой <html><body> для маркетинга
│   └── page.tsx     →  /
└── (app)/
    ├── layout.tsx   ← свой <html><body> для приложения
    └── dashboard/
        └── page.tsx →  /dashboard
```

**Применить `loading.tsx` только к одному роуту** без влияния на соседние:

```
app/dashboard/
├── (overview)/
│   ├── loading.tsx   ← только для /dashboard, не для /dashboard/settings
│   └── page.tsx      →  /dashboard
└── settings/
    └── page.tsx      →  /dashboard/settings (loading.tsx не применяется)
```

---

#### 1.12.3 Важные правила

- Скобки `(name)` убирают папку из URL, но **не из файловой системы** — layout.tsx внутри группы реально существует и применяется
- Роуты из разных групп **не должны давать одинаковый URL** — `(a)/about/page.tsx` и `(b)/about/page.tsx` оба дают `/about` → конфликт, ошибка сборки
- `(auth)` — это только имя для организации, любое слово в скобках работает: `(marketing)`, `(admin)`, `(public)`

---

### 1.13 Приватные папки

Префикс `_` исключает папку из роутинга полностью:

```
app/
└── dashboard/
    ├── page.tsx
    └── _components/      ← не роутится, безопасное место для UI-компонентов
        └── Chart.tsx
```

---

### 1.14 Компонент `<Link>`

`<Link>` расширяет HTML `<a>`, добавляя клиентскую навигацию и prefetching. Это основной способ перемещения между страницами в Next.js.

```tsx
import Link from 'next/link'

// Все атрибуты <a> работают: className, target, rel и т.д.
<Link href="/dashboard" className="nav-link" target="_blank">
  Dashboard
</Link>
```

---

#### Пропсы

**`href`** — обязательный, `string | object`

Путь или URL для перехода. Может быть строкой или объектом с `pathname` и `query`:

```tsx
// Строка
<Link href="/dashboard">Dashboard</Link>

// Динамический сегмент
<Link href={`/photo/${car.id}`}>{car.name}</Link>  // из нашего page.tsx

// Объект — удобно для query string
<Link href={{ pathname: '/shop', query: { category: 'clothing', brand: 'nike' } }}>
  Nike Clothing
</Link>
// результат: /shop?category=clothing&brand=nike

// Якорная ссылка — скроллит к элементу с id="settings"
<Link href="/dashboard#settings">Settings</Link>
```

---

**`replace`** — `boolean`, дефолт `false`

По умолчанию `<Link>` добавляет новый URL в стек истории браузера (`history.push`). С `replace={true}` — заменяет текущую запись (`history.replace`). Кнопка "Назад" не вернёт на предыдущую страницу.

```tsx
// Полезно для редиректов после логина — чтобы кнопка "Назад"
// не возвращала на форму входа
<Link href="/dashboard" replace>
  Войти в систему
</Link>
```

---

**`scroll`** — `boolean`, дефолт `true`

Управляет прокруткой при навигации. По умолчанию Next.js сохраняет позицию скролла если страница видима во вьюпорте, иначе скроллит к верху страницы. При `scroll={false}` — позиция скролла не меняется никогда.

```tsx
// Полезно в таблицах с пагинацией — не прыгать наверх при смене страницы
<Link href="/users?page=2" scroll={false}>
  Следующая страница
</Link>

// Или через useRouter:
router.push('/dashboard', { scroll: false })
```

---

**`prefetch`** — `"auto" | true | false | null`, дефолт `"auto"`

Контролирует предзагрузку страницы. **Работает только в production** (`next build`).

| Значение | Поведение |
|---|---|
| `"auto"` или `null` (дефолт) | Статические роуты — загружает полностью. Динамические — загружает до ближайшего `loading.tsx` |
| `true` | Загружает полностью для всех роутов, включая динамические |
| `false` | Отключает prefetch полностью — ни при попадании во viewport, ни при hover |

```tsx
// Отключить для тяжёлых страниц которые редко посещают
<Link href="/analytics" prefetch={false}>
  Analytics
</Link>

// Принудительно загрузить динамический роут полностью
<Link href="/dashboard/[id]" prefetch={true}>
  Dashboard
</Link>
```

---

**`onNavigate`** — `(e: NavigateEvent) => void`

Вызывается **только при клиентской навигации** (SPA-переход). Принимает объект события с методом `e.preventDefault()` для отмены перехода.

```tsx
'use client'
// Важно: onNavigate требует клиентского компонента

<Link
  href="/dashboard"
  onNavigate={(e) => {
    if (hasUnsavedChanges) {
      e.preventDefault()  // отменяет переход
      alert('Сохраните изменения перед выходом')
    }
  }}
>
  Dashboard
</Link>
```

**`onNavigate` vs `onClick` — ключевые отличия:**

| | `onClick` | `onNavigate` |
|---|---|---|
| Срабатывает при любом клике | Да | Нет |
| Ctrl/Cmd + Click (новая вкладка) | Да | **Нет** |
| Внешние URL | Да | **Нет** |
| `download` атрибут | Да | **Нет** |
| Отмена навигации | Нет | **Да** (`e.preventDefault()`) |

---

**`transitionTypes`** — `string[]`

Передаёт типы анимации для [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Значения попадают в `React.addTransitionType` и позволяют `<ViewTransition>` компонентам применять разные анимации в зависимости от типа перехода.

```tsx
<Link href="/about" transitionTypes={['slide-in']}>
  About
</Link>
```

---

#### Активная ссылка — `usePathname()`

`usePathname()` возвращает текущий путь URL в виде строки. Только в `'use client'` компонентах, импортируется из `next/navigation`.

```tsx
'use client'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  console.log(pathname) // '/dashboard', '/dashboard/settings', ...
}
```

**Что возвращает:**

| URL в браузере | `usePathname()` |
|---|---|
| `/dashboard` | `"/dashboard"` |
| `/dashboard/settings` | `"/dashboard/settings"` |
| `/shop/clothing/nike` | `"/shop/clothing/nike"` |

Не включает query string (`?q=test`) и хэш (`#section`) — только путь.

---

**Применение — подсветка активного пункта меню**

В нашем `Sidebar.tsx` используется для определения активного пункта навигации:

```tsx
const pathname = usePathname()

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: ... },
  { href: '/dashboard/settings', label: 'Settings', icon: ... },
  { href: '/dashboard/analytics', label: 'Analytics', icon: ... },
]

{menuItems.map((item) => (
  <Link
    key={item.href}
    href={item.href}
    className={`flex items-center gap-2 text-sm transition-colors group ${
      pathname === item.href
        ? 'text-blue-500 dark:text-sky-400'
        : 'text-zinc-400 hover:text-blue-500 dark:hover:text-sky-400'
    }`}
  >
    {item.label}
  </Link>
))}
```

---

**Частая ошибка — конфликт классов Tailwind**

Tailwind применяет класс не по порядку в строке, а по порядку определения в сгенерированном CSS-файле. Поэтому нельзя просто добавить активный класс поверх базового:

```tsx
// ❌ Не работает — text-zinc-400 всегда присутствует и перебивает text-blue-500
className={`text-zinc-400 ${pathname === href ? 'text-blue-500' : ''}`}

// ✅ Правильно — классы взаимно исключающие
className={pathname === href ? 'text-blue-500' : 'text-zinc-400 hover:text-blue-500'}
```

Правило: **базовый цвет и активный цвет не должны присутствовать в строке одновременно** — нужно делать их условными через тернарный оператор.

---

#### `useRouter` — программная навигация

Для навигации из обработчиков событий используется хук `useRouter`. Только в `'use client'` компонентах. Импортируется из `next/navigation` (не из `next/router`).

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function DashboardLayout() {
  const router = useRouter()
  // ...
}
```

В нашем проекте `useRouter` используется в `dashboard/layout.tsx` — кнопка Logout вызывает `router.push('/')`.

---

**`router.push(href, options?)`**

Клиентская навигация с добавлением новой записи в стек истории браузера. Кнопка "Назад" вернёт на предыдущую страницу.

```tsx
router.push('/dashboard')

// С опциями:
router.push('/dashboard', {
  scroll: false,           // не скроллить наверх после перехода (по умолчанию true)
  transitionTypes: ['slide-in'],  // типы анимации для View Transitions API
})
```

---

**`router.replace(href, options?)`**

То же что `push`, но **заменяет** текущую запись в истории вместо добавления новой. Кнопка "Назад" не вернёт на страницу откуда произошёл replace.

```tsx
// После успешного логина — чтобы кнопка "Назад" не возвращала на форму входа
router.replace('/dashboard')

router.replace('/dashboard', {
  scroll: false,
  transitionTypes: ['fade'],
})
```

| | `push` | `replace` |
|---|---|---|
| Добавляет в историю | Да | Нет |
| "Назад" работает | Да | Нет |
| Типичный сценарий | Обычная навигация | После логина / редирект |

---

**`router.refresh()`**

Обновляет текущий роут: делает новый запрос к серверу, перерендеривает Server Components и сбрасывает Client Cache для текущего роута. **Не перезагружает браузер** — клиентское состояние (`useState`, позиция скролла) сохраняется.

```tsx
// Например после мутации данных (добавили запись в БД)
await saveComment(data)
router.refresh()  // подтянет новые данные с сервера без потери состояния формы
```

> `refresh()` сбрасывает только **клиентский кэш**. Для инвалидации серверного кэша используются `revalidatePath()` / `revalidateTag()`.

---

**`router.prefetch(href, options?)`**

Вручную предзагружает роут для более быстрого перехода. `<Link>` делает это автоматически при появлении во вьюпорте, `router.prefetch` позволяет управлять этим вручную.

```tsx
// Предзагрузить при hover на кастомный элемент
<div onMouseEnter={() => router.prefetch('/dashboard')}>
  Dashboard
</div>

// С callback который срабатывает когда данные устарели
router.prefetch('/dashboard', {
  onInvalidate: () => {
    // данные протухли — можно перезапустить prefetch
    router.prefetch('/dashboard')
  },
})
```

---

**`router.back()`**

Возврат на предыдущую страницу в стеке истории. Аналог кнопки "Назад" браузера.

```tsx
// Из нашего CloseButton — закрывает модалку и возвращает на /
<button onClick={() => router.back()}>✕ Close</button>
```

---

**`router.forward()`**

Переход вперёд в стеке истории. Аналог кнопки "Вперёд" браузера.

```tsx
router.forward()
```

---

**Все методы в одной таблице:**

| Метод | Опции | Описание |
|---|---|---|
| `router.push(url)` | `scroll`, `transitionTypes` | Переход + новая запись в историю |
| `router.replace(url)` | `scroll`, `transitionTypes` | Переход + замена текущей записи |
| `router.refresh()` | — | Обновить данные Server Components без перезагрузки |
| `router.prefetch(url)` | `onInvalidate` | Предзагрузить роут вручную |
| `router.back()` | — | Назад в истории |
| `router.forward()` | — | Вперёд в истории |

---

**Отслеживание событий навигации**

В App Router нет `router.events`. Вместо этого используется комбинация `usePathname` + `useSearchParams` в `useEffect`:

```tsx
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Срабатывает при каждой навигации
    console.log('Navigated to:', pathname, searchParams.toString())
  }, [pathname, searchParams])

  return null
}
```

> Компонент с `useSearchParams` нужно оборачивать в `<Suspense>` в layout — иначе ошибка при prerendering.

---

**Важно: импорт только из `next/navigation`**

```tsx
// ✅ App Router
import { useRouter } from 'next/navigation'

// ❌ Pages Router — не использовать в App Router
import { useRouter } from 'next/router'
```

---

### 1.15 Metadata (метаданные)

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

### 1.16 Dark Mode с Tailwind

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

### 1.17 Параллельные роуты (`@slot`)

Параллельные роуты позволяют рендерить **несколько страниц одновременно** в одном layout. Папка с префиксом `@` создаёт именованный слот — он передаётся в layout как проп.

```
app/
├── layout.tsx          ← получает { children, modal } как пропсы
├── page.tsx            →  /  (попадает в children)
└── @modal/             ← именованный слот "modal"
    └── (.)photo/
        └── [id]/
            └── page.tsx  →  рендерится в слот modal
```

**Root Layout получает слот как проп:**

```tsx
// app/layout.tsx — из нашего проекта
type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;    // ← слот @modal автоматически передаётся сюда
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html>
      <body>
        {children}  {/* обычная страница — home, dashboard и т.д. */}
        {modal}     {/* слот @modal — рендерится поверх */}
      </body>
    </html>
  );
}
```

**`default.tsx` — обязательный fallback:**

Когда слот не матчит никакой роут (например, мы просто на `/`), Next.js ищет `default.tsx` внутри слота. Без него — ошибка 404 на несвязанных роутах.

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null;  // ← слот невидим когда модалка не открыта
}
```

**Ключевые особенности параллельных роутов:**
- Каждый слот может иметь свои `loading.tsx`, `error.tsx`
- Слоты рендерятся **одновременно**, независимо друг от друга
- Имя папки `@modal` не попадает в URL
- Можно создавать несколько слотов: `@sidebar`, `@modal`, `@analytics` — все придут в layout

---

### 1.18 Перехватывающие роуты (`(.)`)

Перехватывающие роуты позволяют **показать другой роут** внутри текущего layout без полной навигации. Классический паттерн — модальное окно: URL меняется, но пользователь остаётся на той же странице.

**Синтаксис перехвата:**

| Паттерн | Перехватывает | Пример |
|---|---|---|
| `(.)photo` | роут того же уровня | `app/@modal/(.)photo/[id]` перехватывает `app/photo/[id]` |
| `(..)photo` | роут на уровень выше | |
| `(..)(..)photo` | роут на два уровня выше | |
| `(...)photo` | роут от корня `app/` | |

**В нашем проекте — паттерн "modal фото":**

```
app/
├── page.tsx                        →  /  (список машин с кнопками-ссылками)
├── photo/
│   └── [id]/
│       └── page.tsx                →  /photo/1  (полная страница)
└── @modal/
    ├── default.tsx                 ← null, слот пуст на обычных страницах
    └── (.)photo/
        └── [id]/
            └── page.tsx            →  перехватывает /photo/1 → рендерит модалку
```

**Поведение в зависимости от способа перехода:**

| Способ перехода | Что показывается |
|---|---|
| Клик по `<Link href="/photo/1">` с главной | Модалка поверх списка машин (`@modal` слот) |
| Прямой ввод URL `/photo/1` в браузере | Полная страница (`photo/[id]/page.tsx`) |
| Обновление страницы (F5) на `/photo/1` | Полная страница |

**Это работает потому что:**
- `<Link>` — клиентская навигация, Next.js перехватывает роут и рендерит `@modal`
- Прямой URL / F5 — серверный рендеринг, перехват не срабатывает, загружается обычная страница

**Закрытие модалки через `router.back()`:**

```tsx
// app/_components/CloseButton.tsx
"use client";  // ← обязательно, useRouter — клиентский хук
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      ✕ Close
    </button>
  );
}
```

`router.back()` — возвращается на предыдущий URL (`/`), Next.js снова рендерит слот через `default.tsx` который возвращает `null` → модалка исчезает.

**Полная цепочка рендеринга при клике на машину:**

```
Клик <Link href="/photo/1">
  │
  ├── children слот:    app/page.tsx  ←  остаётся, список машин виден на фоне
  │                                      (bg-black/50 оверлей делает его полупрозрачным)
  │
  └── @modal слот:      app/@modal/(.)photo/[id]/page.tsx
                          ├── fixed inset-0 z-50  ← поверх всего
                          ├── bg-black/50          ← фон просвечивает на 50%
                          ├── {car.name}           ← контент модалки
                          └── <CloseButton />      ← router.back() → /
```

**Папка `_components` — приватные компоненты:**

```
app/
└── _components/        ← префикс _ исключает из роутинга
    └── CloseButton.tsx ← переиспользуемый компонент, не является страницей
```

---

### 1.19 Текущая структура проекта

```
src/app/
├── layout.tsx              — Root Layout: получает { children, modal } слоты
├── page.tsx                — "/" список машин CARS с Link на /photo/[id]
├── not-found.tsx           — Глобальная 404 с иллюстрацией астронавта
├── globals.css
├── _components/
│   ├── CloseButton.tsx     — 'use client', router.back() закрывает модалку
│   └── ProjectsLibrary.tsx — 'use client', поиск/фильтры/сортировка через URL
├── @modal/                 — Параллельный слот "modal"
│   ├── default.tsx         — null, слот пуст когда модалка не открыта
│   └── (.)photo/
│       └── [id]/
│           └── page.tsx    — Перехватывает /photo/[id] → рендерит модалку
├── photo/
│   └── [id]/
│       └── page.tsx        — Полная страница /photo/[id] (при прямом переходе)
├── dashboard/
│   ├── layout.tsx          — Nested Layout: сайдбар + main
│   ├── template.tsx        — Template: анимация входа
│   ├── loading.tsx         — Скелетон загрузки
│   ├── error.tsx           — Error boundary ('use client')
│   ├── page.tsx            — "/dashboard", async с задержкой 2s
│   └── settings/
│       └── page.tsx        — "/dashboard/settings"
├── (auth)/
│   ├── layout.tsx          — Auth Layout: центрированная карточка
│   ├── login/
│   │   └── page.tsx        — "/login"
│   └── register/
│       └── page.tsx        — "/register"
├── shop/
│   └── [...slug]/
│       └── page.tsx        — "/shop/x/y/z" (обязательный catch-all)
├── store/
│   └── [[...slug]]/
│       └── page.tsx        — "/store" и "/store/x/y/z" (опциональный catch-all)
└── projects/
    └── page.tsx            — "/projects" Server Component, оборачивает ProjectsLibrary в Suspense
```

---

### 1.20 URL State Management — состояние в адресной строке

Паттерн при котором состояние фильтров, поиска и сортировки хранится в URL (`?query=react&category=nextjs&sort=popular`) вместо `useState`. URL становится **источником истины** — ссылку можно шарить, кнопка "Назад" работает, F5 сохраняет состояние.

---

#### 1.20.1 Почему `useSearchParams` требует `<Suspense>`

`useSearchParams()` читает query-строку URL в Client Component. Next.js **не может статически пренедерить** компонент который зависит от URL — значение неизвестно до момента запроса. Поэтому Next.js выдаёт ошибку если компонент с `useSearchParams` не обёрнут в `<Suspense>`.

**Решение — разделить страницу на два компонента:**

```tsx
// app/projects/page.tsx — Server Component (без 'use client')
import { Suspense } from "react";
import { ProjectsLibrary } from "../_components/ProjectsLibrary";

export default function ProjectsPage() {
  return (
    // Suspense — граница: пока ProjectsLibrary не готова, показывает fallback
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsLibrary />
    </Suspense>
  );
}
```

```tsx
// app/_components/ProjectsLibrary.tsx — Client Component
"use client";
import { useSearchParams } from "next/navigation";
// ...
```

**Почему именно так:** `page.tsx` остаётся Server Component и предоставляет `<Suspense>` boundary. `ProjectsLibrary` — Client Component внутри Suspense, может безопасно читать `useSearchParams()`.

> **Правило:** любой Client Component использующий `useSearchParams` должен быть обёрнут в `<Suspense>` в ближайшем Server Component-родителе.

---

#### 1.20.2 Чтение и запись URL-параметров

```tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const router = useRouter();
const pathname = usePathname();       // "/projects"
const searchParams = useSearchParams(); // read-only URLSearchParams

const [isPending, startTransition] = useTransition();

// Читаем — с дефолтами если параметр не задан
const category = searchParams.get("category") || "all";
const sort = searchParams.get("sort") || "newest";

// Пишем — универсальная функция для обновления любого параметра
const updateParams = (key: string, value: string | null) => {
  // searchParams иммутабелен — клонируем через toString()
  const params = new URLSearchParams(searchParams.toString());

  if (value && value !== "all") {
    params.set(key, value);
  } else {
    params.delete(key); // убираем параметр из URL когда значение дефолтное
  }

  // startTransition помечает навигацию как низкоприоритетную:
  // isPending=true пока роутер применяет URL, но UI не блокируется
  startTransition(() => {
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  });
};
```

`router.replace` вместо `push` — каждое изменение фильтра не добавляет новую запись в историю браузера.

---

#### 1.20.3 Дебаунс для текстового поиска

Текстовый ввод не должен писать в URL при каждом нажатии клавиши — это порождало бы лишние записи в history и перерендеры роутера. Решение — `useState` + `useEffect` с таймером:

```tsx
const [searchQuery, setSearchQuery] = useState(
  searchParams.get("query") || "", // инициализация из URL
);

useEffect(() => {
  const timer = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 300); // 300 мс после последнего нажатия

  return () => clearTimeout(timer); // отменяем если пользователь ещё печатает
}, [searchQuery, pathname, router]);
// searchParams намеренно НЕ в deps — иначе бесконечный цикл:
// searchParams меняется → effect → меняет searchParams → effect → ...
```

**Разделение ответственности:**
- `searchQuery` (useState) — то что видит пользователь в поле ввода, обновляется мгновенно
- `?query=` в URL — обновляется с задержкой 300 мс через `useEffect`
- `filteredProjects` (useMemo) — читает из URL, а не из `searchQuery`

---

#### 1.20.4 Фильтрация и сортировка через `useMemo`

```tsx
const filteredProjects = useMemo(() => {
  const urlQuery = searchParams.get("query") || "";

  return PROJECTS
    .filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(urlQuery.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "popular") return b.stars - a.stars;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}, [searchParams, category, sort]);
// Пересчитывается только когда реально меняется URL — не при каждом ре-рендере
```

---

#### 1.20.5 Схема потока данных

```
Пользователь печатает
  → setSearchQuery (мгновенно, useState)
  → useEffect + debounce 300ms
  → router.replace (обновляет URL)
  → searchParams меняется (Next.js реактивен к URL)
  → useMemo пересчитывает filteredProjects
  → UI обновляется

Пользователь кликает фильтр/сортировку
  → updateParams (без debounce)
  → router.replace
  → searchParams меняется
  → useMemo пересчитывает filteredProjects
  → UI обновляется
```

---

#### 1.20.6 `useTransition` — индикатор навигации

```tsx
const [isPending, startTransition] = useTransition();

// isPending === true пока роутер применяет новый URL
{isPending && (
  <div className="animate-pulse text-blue-500">Синхронизация...</div>
)}
```

`startTransition` помечает обновление как низкоприоритетное — React не блокирует поле ввода пока роутер обрабатывает URL. Без него быстрая печать могла бы "замораживать" интерфейс.

---

*Следующие темы для изучения: Server vs Client Components, Data Fetching, Caching*
