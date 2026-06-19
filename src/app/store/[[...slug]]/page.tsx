type StorePageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  const currentSlug = slug ?? [];

  const [category, brand, model] = currentSlug;

  return (
    <div className="min-h-screen font-sans bg-zinc-950 text-white">
      {/* Header */}
      <header className="px-10 pt-14 pb-10 border-b border-zinc-800">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-3">
          {brand ? `Exploring ${brand} collection` : "Browse all products"}
        </p>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
          {category ? (
            <>
              <span className="text-zinc-400">Catalog</span>
              <span className="mx-3 text-zinc-700">/</span>
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent px-4 py-4">
                {category}
              </span>
            </>
          ) : (
            "Main Store"
          )}
        </h1>
      </header>

      <div className="px-10 py-10 flex flex-col gap-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-zinc-500">Store</span>
          {currentSlug.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-zinc-700">/</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide capitalize
                ${index === 0 ? "bg-zinc-800 text-zinc-300" : ""}
                ${index === 1 ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : ""}
                ${index === 2 ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : ""}
              `}
              >
                {item.trim()}
              </span>
            </div>
          ))}
        </nav>

        {/* Welcome — показывается когда нет категории */}
        {!category && (
          <div className="rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-16 text-center">
            <p className="text-5xl mb-4">🛍️</p>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to the Store
            </h2>
            <p className="text-zinc-500 text-sm">
              Add a category to the URL to start browsing
            </p>
            <div className="mt-6 inline-flex gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700">
              <span className="text-zinc-500 text-xs font-mono">/store/</span>
              <span className="text-blue-400 text-xs font-mono">clothing</span>
              <span className="text-zinc-600 text-xs font-mono">
                /nike/tracksuit
              </span>
            </div>
          </div>
        )}

        {/* Active Filter — показывается когда есть категория */}
        {category && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-blue-400 mb-4">
              Active Filters
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Category
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-semibold capitalize">
                  {category}
                </span>
              </div>
              {brand && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Brand
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-sm font-semibold capitalize">
                    {brand}
                  </span>
                </div>
              )}
              {model && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Model
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm font-semibold capitalize">
                    {model.replace("-", " ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug */}
        <p className="text-[10px] text-rose-400 font-mono bg-rose-950/40 border border-rose-800/60 rounded-lg px-4 py-3 inline-block w-fit">
          [DEBUG] Raw segments: {JSON.stringify(currentSlug)}
        </p>
      </div>
    </div>
  );
}
