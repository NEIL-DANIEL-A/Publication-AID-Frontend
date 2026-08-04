export function SkeletonCard() {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-4 animate-pulse"
      aria-hidden="true"
    >
      {/* Header badges */}
      <div className="flex items-center gap-2">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
      </div>

      {/* Organizer */}
      <div className="skeleton h-4 w-1/2 rounded-lg" />

      {/* Divider */}
      <div className="border-t border-neutral-100 dark:border-neutral-800" />

      {/* Meta rows */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 w-24 rounded-lg" />
        </div>
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 w-24 rounded-lg" />
        </div>
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded-lg" />
        </div>
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded-lg" />
        </div>
      </div>

      {/* Countdown pill */}
      <div className="skeleton h-6 w-28 rounded-full" />

      {/* Button */}
      <div className="skeleton h-10 w-full rounded-xl mt-1" />
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
