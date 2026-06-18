"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-row flex-1 border-4 border-blue-500 dark:border-zinc-700 rounded-xl m-4 overflow-hidden">
      <aside className="w-1/5 bg-blue-50 dark:bg-zinc-900 p-6 border-r border-blue-100 dark:border-zinc-800 flex flex-col">
        <div className="mb-8 text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest font-sans">
          Dashboard Layout
        </div>
        <nav className="flex flex-col gap-4">
          <span className="font-bold text-sm text-zinc-400 dark:text-zinc-500">
            Navigation
          </span>
          <Link
            href="/dashboard"
            className="text-zinc-400 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-zinc-400 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-200">
          <label className="block text-[10px] font-bold text-blue-400 uppercase mb-2">
            Persistent State (Layout)
          </label>
          <input
            type="text"
            value={text}
            className="w-full p-2 text-sm border border-blue-200 rounded bg-white text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setText(e.target.value)}
            placeholder="Text will be save..."
          />
        </div>
      </aside>
      <main className="flex-1 p-8 flex flex-col dark:bg-zinc-800">
        {children}
      </main>
    </div>
  );
}
