import clsx from 'clsx'

export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80',
        className,
      )}
      aria-hidden
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}
