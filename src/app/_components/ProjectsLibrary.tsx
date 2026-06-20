// "use client" — обязателен, потому что компонент использует хуки (useState, useEffect)
// и браузерные API. Без этой директивы Next.js попытается рендерить страницу на сервере
// и бросит ошибку при использовании хуков.
"use client";

// usePathname — возвращает текущий URL-путь (/projects), нужен для построения ссылок
// useRouter — программная навигация (replace/push) без полной перезагрузки страницы
// useSearchParams — читает ?query=...&category=...&sort=... из URL (read-only)
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// useEffect — запускает сайд-эффект (таймер дебаунса) при изменении searchQuery
// useMemo — мемоизирует результат фильтрации/сортировки, пересчитывает только при
//           изменении searchParams, category или sort
// useState — локальное состояние поля ввода (управляемый компонент)
// useTransition — помечает обновления URL как "низкоприоритетные", чтобы UI
//                 не блокировался. isPending === true пока роутер применяет новый URL
import { useEffect, useMemo, useState, useTransition } from "react";

// Статические данные — в реальном приложении это был бы fetch() к API или БД
const PROJECTS = [
  {
    id: 2,
    title: "LMS Education Dashboard",
    desc: "Панель управления образовательной платформой на Next.js 15 с использованием Server Components.",
    category: "nextjs",
    stars: 450,
    date: "2026-05-01",
  },
  {
    id: 4,
    title: "Edge Authentication Service",
    desc: "Быстрая авторизация на базе Elysia и Redis, развернутая на Edge-функциях.",
    category: "elysia",
    stars: 210,
    date: "2026-05-12",
  },
  {
    id: 5,
    title: "Dark Minimalist UI Library",
    desc: "Библиотека UI-компонентов в стиле глубокого минимализма с поддержкой серверного рендеринга.",
    category: "nextjs",
    stars: 330,
    date: "2026-02-20",
  },
];

// Tailwind-классы для бейджей категорий вынесены в словарь, чтобы не дублировать строки
const categoryColors: Record<string, string> = {
  nextjs: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  elysia: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
};

export const ProjectsLibrary = () => {
  const router = useRouter();
  const pathname = usePathname(); // "/projects"
  const searchParams = useSearchParams(); // read-only объект URLSearchParams

  // useTransition позволяет показать индикатор загрузки (isPending) пока роутер
  // применяет новый URL, не замораживая при этом поле ввода
  const [isPending, startTransition] = useTransition();

  // searchQuery — локальное состояние поля ввода.
  // Инициализируется из URL, чтобы при прямом переходе /?query=react поле было заполнено.
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );

  // Читаем category и sort из URL. Если параметра нет — используем дефолты.
  // Это паттерн "URL как источник истины": состояние хранится в адресной строке,
  // что позволяет шарить ссылки и работать с кнопкой "назад" браузера.
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";

  // Дебаунс для поиска: записываем в URL только спустя 300 мс после последнего нажатия.
  // Без дебаунса каждое нажатие клавиши порождало бы новую запись в history и
  // лишний рендер роутера.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Клонируем текущие параметры, чтобы не потерять category и sort
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set("query", searchQuery);
      } else {
        // Удаляем параметр из URL, когда поле пустое, чтобы не было ?query=
        params.delete("query");
      }

      // router.replace — меняет URL без добавления новой записи в историю браузера
      // scroll: false — страница не прокручивается вверх при каждом изменении
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    }, 300);

    // Cleanup: отменяем предыдущий таймер если пользователь ещё печатает
    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router]);
  // Намеренно не включаем searchParams в deps-массив: нас интересует только
  // изменение searchQuery. Включение searchParams привело бы к бесконечному циклу.

  // useMemo гарантирует, что фильтрация и сортировка не запускаются при каждом
  // ре-рендере, а только когда реально меняются searchParams, category или sort.
  const filteredProjects = useMemo(() => {
    const urlQuery = searchParams.get("query") || "";

    return PROJECTS.filter((p) => {
      // Поиск по подстроке в заголовке и описании (регистронезависимый)
      const matchesQuery =
        p.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(urlQuery.toLowerCase());

      // Фильтр по категории: "all" отключает фильтрацию
      const matchesCategory = category === "all" || p.category === category;

      return matchesQuery && matchesCategory;
    }).sort((a, b) => {
      // Сортировка: по звёздам (популярность) или по дате (новизна)
      if (sort === "popular") {
        return b.stars - a.stars;
      }
      // Сравниваем даты через getTime() для надёжности
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [searchParams, category, sort]);

  // Универсальная функция для обновления любого URL-параметра.
  // Используется для category и sort — не требует дебаунса, т.к. это клик, не ввод.
  const updateParams = (key: string, value: string | null) => {
    // Клонируем параметры — searchParams иммутабелен, нельзя изменить напрямую
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      // Удаляем параметр для "all" или null — URL остаётся чистым
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };
  return (
    <div className="min-h-screen bg-black text-zinc-200 p-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
            Project Library
          </h1>
          <p className="text-zinc-500 font-medium">
            Управление состоянием: Поиск, Фильтры, Сортировка.
          </p>
        </div>

        {/* Индикатор загрузки — виден только пока useTransition применяет новый URL */}
        <div className="h-8 flex items-center">
          {isPending && (
            <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Синхронизация...
            </div>
          )}
        </div>
      </div>

      {/* Grid: sidebar (фильтры) + main (карточки) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-8">
          {/* Поиск: управляемый input с дебаунсом через useEffect выше */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Поиск
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Название или описание..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Фильтр по категории: клик сразу пишет в URL через updateParams */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Технология
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "elysia", "nextjs"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParams("category", cat)}
                  // Активная кнопка определяется из URL (category), а не из локального state
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Сортировка: select синхронизируется с URL-параметром sort */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Сортировка
            </label>
            <select
              value={sort}
              onChange={(e) => updateParams("sort", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
            >
              <option value="newest">Сначала новые</option>
              <option value="popular">Самые популярные</option>
            </select>
          </div>
        </aside>

        {/* Основная область: 3/4 ширины на больших экранах */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-blue-600/10 text-blue-500 px-2 py-1 rounded uppercase">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    {project.stars}
                  </span>
                </div>
                {/* group-hover: при ховере на карточку (group) меняем цвет заголовка */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {project.desc}
                </p>
              </div>
            ))}

            {/* Пустое состояние — показываем когда фильтры не дали результатов */}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-medium">Ничего не найдено</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
