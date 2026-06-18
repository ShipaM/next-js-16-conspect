export default function DashboardLoading() {
  return (
    <div className="animate-pulse flex space-x-4 p-4 bg-white dark:bg-zinc-800 rounded-lg w-full">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
