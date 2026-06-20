import { type ReactNode } from "react";
import { Sidebar } from "../_components/layout/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-row flex-1 border-4 border-blue-500 dark:border-zinc-700 rounded-xl m-4 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 flex flex-col dark:bg-zinc-800">
        {children}
      </main>
    </div>
  );
}
