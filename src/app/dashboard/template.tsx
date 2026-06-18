"use client";

import { useEffect, useState, type ReactNode } from "react";

type DashboardTemplateProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardTemplateProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Template: Mounting...(We have navigated to this page)");
  }, []);

  return (
    <div className="flex-1 border-4 p-8 border-dashed border-purple-500 rounded-lg flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">
          Dashboard Template
        </div>
        <div className="flex flex-col items-end">
          <label className="text-[10px] font-bold text-purple-300 uppercase mb-1">
            Volatile State (Template)
          </label>
          <input
            type="text"
            value={text}
            className="p-2 text-sm border-2 border-purple-200 rounded bg-white text-black focus:border-purple-400 w-lg outline-none"
            onChange={(e) => setText(e.target.value)}
            placeholder="Text will be cleaned up on switch to another page..."
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col dark:bg-zinc-800">{children}</div>
    </div>
  );
}
