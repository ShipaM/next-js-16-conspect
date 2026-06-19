"use client";

import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-colors"
    >
      ✕ Close
    </button>
  );
}
