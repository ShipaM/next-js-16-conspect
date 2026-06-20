"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
  const [text, setText] = useState("");
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      ),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </>
      ),
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: (
        <>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </>
      ),
    },
  ];

  return (
    <aside className="w-1/5 bg-blue-50 dark:bg-zinc-900 p-6 border-r border-blue-100 dark:border-zinc-800 flex flex-col">
      <div className="mb-8 text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest font-sans">
        Dashboard Layout
      </div>
      <nav className="flex flex-col gap-4">
        <span className="font-bold text-sm text-zinc-400 dark:text-zinc-500">
          Navigation
        </span>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 text-sm transition-colors group ${
              pathname === item.href
                ? "text-blue-500 dark:text-sky-400"
                : "text-zinc-400 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-sky-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => router.replace("/")}
          // onClick={() => router.push("/")}
          // onClick={() => router.back()}
          // onClick={() => router.forward()}
          // onClick={() => router.refresh()}
          className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group mt-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
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
  );
};
