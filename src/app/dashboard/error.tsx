"use client";

type DashboardErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardErrorPage({
  error,
  reset,
}: DashboardErrorPageProps) {
  return (
    <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-lg">
      <h2 className="text-xl font-bold text-rose-700">Dashboard error page</h2>
      <p className="text-rose-600 text-sm dark:text-rose-400 mt-2 font-mone">
        {error.message}
      </p>
      <p className="text-rose-600 text-sm dark:text-rose-400 mt-2 font-mone">
        {error.digest}
      </p>
      <button
        onClick={() => reset()}
        className="text-rose-600 text-sm dark:text-rose-400 mt-2 font-mone p-3 border-2 bg-rose-200 rounded"
      >
        Try again
      </button>
    </div>
  );
}
