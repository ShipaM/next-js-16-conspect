import { notFound } from "next/navigation";

export default function DashboardSettingsPage() {
  // const data = null;

  // if (!data) notFound();

  return (
    <div className="p-4 bg-amber-50 border-2 border-amber-500 ">
      <h1 className="text-xl font-bold text-bold text-amber-700">
        Settings Page
      </h1>
      <p className="text-amber-600 dark:text-amber-400 mt-2">
        This is the dashboard settings page by path `/dashboard/settings`
      </p>
    </div>
  );
}
