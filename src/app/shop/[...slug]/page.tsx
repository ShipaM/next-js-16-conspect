type ShopPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;

  const [category, brand, model] = slug;

  return (
    <div className="min-h-screen font-sans bg-zinc-950 text-white">
      {/* Hero header */}
      <div className="px-10 pt-14 pb-10 border-b border-zinc-800">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-3">
          Next.js — catch-all segment
        </p>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          {brand?.trim() || "All brands"}
          {model && (
            <span className="ml-4 bg-linear-to-r from-blue-400 to-cyan-400  bg-clip-text text-transparent px-4 py-4">
              / {model.replace("-", " ")}
            </span>
          )}
        </h1>
      </div>

      <div className="px-10 py-10 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-zinc-400">Shop</span>
          {slug.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-zinc-600">/</span>
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

        {/* Product card */}
        <div className="max-w-2xl rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700/60 shadow-2xl shadow-black/50 p-8 hover:border-blue-500/40 transition-all duration-300 hover:shadow-blue-950/50">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                Category
              </span>
              <p className="text-2xl font-semibold capitalize mt-1 text-zinc-100">
                {category}
              </p>
            </div>

            {brand && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                  Brand
                </span>
                <p className="text-2xl font-semibold capitalize mt-1 text-zinc-100">
                  {brand.trim()}
                </p>
              </div>
            )}

            {model && (
              <div className="border-t border-zinc-700 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                  Model
                </span>
                <p className="text-6xl font-black uppercase tracking-tight mt-2 bg-linear-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent leading-none">
                  {model.replace("-", " ")}
                </p>
              </div>
            )}
          </div>

          {/* Decorative accent */}
          <div className="mt-8 h-px bg-linear-to-r from-blue-500/40 via-cyan-500/40 to-transparent" />
          <div className="mt-4 flex gap-2">
            {["New Season", "In Stock", "Free Shipping"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-700 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Debug */}
        <p className="text-[10px] text-rose-400 font-mono bg-rose-950/40 border border-rose-800/60 rounded-lg px-4 py-3 inline-block w-fit">
          [DEBUG] Raw segments: {JSON.stringify(slug)}
        </p>
      </div>
    </div>
  );
}
