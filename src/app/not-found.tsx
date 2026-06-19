import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16 bg-linear-to-b from-slate-50 via-indigo-50 to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">

      <svg
        viewBox="0 0 500 380"
        className="w-80 mb-10 drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stars */}
        {[
          [50, 55, 2], [420, 28, 1.5], [380, 95, 2.5], [22, 190, 1.5],
          [462, 175, 2], [105, 300, 1.5], [448, 295, 2], [155, 45, 1],
          [298, 18, 2], [28, 345, 1.5], [70, 180, 1], [340, 60, 1.5],
          [480, 130, 1], [10, 100, 1.5], [260, 340, 1],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#94a3b8" opacity={0.4 + (i % 3) * 0.15} />
        ))}

        {/* Sparkles */}
        {([
          [62, 148, "#f59e0b"],
          [432, 78, "#f59e0b"],
          [88, 248, "#a78bfa"],
          [470, 230, "#a78bfa"],
          [30, 270, "#6ee7b7"],
        ] as [number, number, string][]).map(([x, y, color], i) => (
          <g key={i} opacity={0.7}>
            <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={color} strokeWidth="2" />
            <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={color} strokeWidth="2" />
          </g>
        ))}

        {/* Planet */}
        <circle cx="385" cy="305" r="88" fill="#e0e7ff" className="dark:fill-indigo-950" />
        <circle cx="365" cy="275" r="13" fill="#c7d2fe" opacity="0.6" />
        <circle cx="405" cy="315" r="8"  fill="#c7d2fe" opacity="0.5" />
        <circle cx="355" cy="325" r="5"  fill="#c7d2fe" opacity="0.5" />
        <ellipse cx="385" cy="305" rx="118" ry="20" fill="none" stroke="#a5b4fc" strokeWidth="10" opacity="0.35" />

        {/* Tether */}
        <path d="M 225 178 Q 268 205 308 228" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.45" />

        {/* Left arm */}
        <rect x="118" y="158" width="17" height="46" rx="8.5" fill="#e2e8f0" transform="rotate(-28,126,163)" />
        {/* Right arm (raised) */}
        <rect x="222" y="142" width="17" height="46" rx="8.5" fill="#e2e8f0" transform="rotate(38,230,147)" />

        {/* Body */}
        <rect x="140" y="168" width="82" height="92" rx="24" fill="#f1f5f9" className="dark:fill-zinc-300" />
        {/* Chest panel */}
        <rect x="156" y="188" width="50" height="32" rx="8" fill="#e0e7ff" className="dark:fill-indigo-200" />
        <circle cx="168" cy="200" r="4" fill="#a5b4fc" />
        <circle cx="181" cy="200" r="4" fill="#6ee7b7" />
        <circle cx="194" cy="200" r="4" fill="#fca5a5" />
        <rect x="161" y="212" width="40" height="4" rx="2" fill="#c7d2fe" />
        {/* Belt */}
        <rect x="140" y="244" width="82" height="12" rx="6" fill="#e2e8f0" className="dark:fill-zinc-400" />

        {/* Backpack */}
        <rect x="220" y="172" width="24" height="54" rx="7" fill="#cbd5e1" className="dark:fill-zinc-400" />
        <rect x="225" y="185" width="14" height="8" rx="3" fill="#a5b4fc" opacity="0.6" />
        <rect x="225" y="200" width="14" height="8" rx="3" fill="#6ee7b7" opacity="0.6" />

        {/* Helmet */}
        <circle cx="181" cy="144" r="40" fill="#f1f5f9" className="dark:fill-zinc-300" />
        {/* Visor */}
        <ellipse cx="181" cy="147" rx="26" ry="24" fill="#7dd3fc" opacity="0.85" />
        {/* Visor reflection */}
        <ellipse cx="171" cy="139" rx="9" ry="7" fill="white" opacity="0.35" />
        <ellipse cx="183" cy="135" rx="4" ry="3" fill="white" opacity="0.2" />
        {/* Helmet ring */}
        <circle cx="181" cy="144" r="40" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-zinc-400" />

        {/* Left leg */}
        <rect x="150" y="252" width="19" height="48" rx="9.5" fill="#e2e8f0" className="dark:fill-zinc-300" transform="rotate(-7,159,252)" />
        <ellipse cx="152" cy="298" rx="15" ry="9" fill="#cbd5e1" className="dark:fill-zinc-400" transform="rotate(-7,152,298)" />

        {/* Right leg */}
        <rect x="192" y="252" width="19" height="48" rx="9.5" fill="#e2e8f0" className="dark:fill-zinc-300" transform="rotate(7,201,252)" />
        <ellipse cx="210" cy="298" rx="15" ry="9" fill="#cbd5e1" className="dark:fill-zinc-400" transform="rotate(7,210,298)" />

        {/* Gloves */}
        <circle cx="106" cy="182" r="11" fill="#cbd5e1" className="dark:fill-zinc-400" />
        <circle cx="254" cy="160" r="11" fill="#cbd5e1" className="dark:fill-zinc-400" />
      </svg>

      <p className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-400 dark:text-indigo-400 mb-3">
        Lost in space
      </p>

      <h1 className="text-8xl font-black tracking-tight bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 leading-none">
        404
      </h1>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-zinc-200 mb-3">
        Page not found
      </h2>

      <p className="text-slate-500 dark:text-zinc-400 max-w-sm mb-10 leading-relaxed">
        The page you are looking for has drifted off into the void. Let&apos;s get you back on track.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-200 dark:shadow-indigo-950 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        ← Back to home
      </Link>
    </div>
  );
}
