export function ChatListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="h-12 w-12 bg-slate-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
            <div className="h-3 w-16 bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3">
          <div className="h-10 w-10 bg-slate-700 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 bg-slate-700 rounded w-24" />
              <div className="h-2 bg-slate-700 rounded w-16" />
            </div>
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
            <div className="h-4 bg-slate-700 rounded w-24 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplateSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-slate-700 rounded w-48" />
                <div className="h-3 bg-slate-700 rounded w-24" />
              </div>
              <div className="h-6 w-20 bg-slate-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
