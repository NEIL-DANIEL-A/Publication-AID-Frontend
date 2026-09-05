export function SkeletonCard() {
  return (
    <div
      className="glass-card flex flex-col animate-pulse overflow-hidden"
      style={{ height: '420px' }}
      aria-hidden="true"
    >
      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-h-0">
        {/* Badges */}
        <div className="flex items-center gap-2 h-6 shrink-0">
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-10 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>

        {/* Title block — 72px */}
        <div className="shrink-0 space-y-1.5" style={{ height: '72px' }}>
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-4/5 rounded-md" />
          <div className="skeleton h-3 w-1/3 rounded-md mt-1" />
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 shrink-0" />

        {/* Meta grid — 4 cells */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 shrink-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="skeleton h-2.5 w-14 rounded" />
              <div className="skeleton h-3.5 w-20 rounded-md" />
            </div>
          ))}
        </div>

        {/* SJR row — 32px */}
        <div className="shrink-0 space-y-1" style={{ height: '32px' }}>
          <div className="skeleton h-2.5 w-12 rounded" />
          <div className="skeleton h-3.5 w-16 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-5 w-5 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton h-9 rounded-xl" />
          <div className="skeleton h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Grid of skeleton cards */
export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
