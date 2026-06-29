async function getGithubProfile() {
  const res = await fetch("https://api.github.com/users/vercel", {
    // Данные кешируются навсегда (до следующего билда).
    // Подходит для статичного контента: документация, прайс-листы, конфиги.
    cache: "force-cache",

    // Кеш не используется — каждый запрос идёт на сервер.
    // Подходит для данных реального времени: курсы валют, чаты, live-статусы.
    // cache: "no-store",

    // Кеш используется, если есть свежая копия; иначе идёт на сервер и обновляет кеш.
    // Стандартное поведение браузера. В Next.js по умолчанию ведёт себя как "force-cache".
    // cache: "default",

    // Берёт данные только из кеша. Если кеша нет — выбрасывает ошибку (не делает сетевой запрос).
    // Подходит для prefetch-сценариев, где запрос должен быть гарантированно закеширован заранее.
    // cache: "only-if-cached",

    // ISR (Incremental Static Regeneration): кеш живёт N секунд, потом обновляется в фоне.
    // Подходит для данных, которые меняются редко: каталог товаров, статьи блога.
    // next: {
    //   revalidate: 60, // секунды
    // },

    // Ревалидация по тегу: кеш сбрасывается вручную через revalidateTag("tag").
    // Подходит для контента из CMS — обновление происходит при публикации, а не по таймеру.
    // next: {
    //   tags: ["github-profile"],
    // },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export default async function page() {
  const profile = await getGithubProfile();
  return (
    <main className="p-10 bg-black text-white min-h-screen">
      <h2>Profile: {profile.name}</h2>
      <p>Desc: {profile.description}</p>
      <p>Public repos: {profile.public_repos}</p>
    </main>
  );
}
