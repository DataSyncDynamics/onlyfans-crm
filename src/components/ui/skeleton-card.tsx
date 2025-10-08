export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-6 shadow-lg">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-800/70"></div>
          <div className="h-8 w-8 rounded-lg bg-slate-800/70"></div>
        </div>

        {/* Main value */}
        <div className="space-y-2">
          <div className="h-8 w-32 rounded bg-slate-700/70"></div>
          <div className="h-3 w-20 rounded bg-slate-800/70"></div>
        </div>
      </div>
    </div>
  );
}
