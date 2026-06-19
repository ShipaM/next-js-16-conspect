import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Accent line */}
        <div className="h-1 bg-linear-to-r from-blue-500 via-violet-500 to-cyan-500" />

        <div className="p-10">
          <header className="text-center mb-10">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-violet-600 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-blue-950">
              <div className="w-6 h-6 border-[3px] border-white rounded-full" />
            </div>
            <h2 className="text-white text-2xl font-bold tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Enter your details to continue
            </p>
          </header>

          {children}

          <footer className="text-center mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">
              Secure Authentication System
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
