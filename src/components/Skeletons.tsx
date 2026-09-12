import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="rounded-[28px] border border-line bg-white/[0.035] px-6 sm:px-10 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-16 w-32" />
        </div>
      </div>
      <Skeleton className="h-24 w-full max-w-[220px] justify-self-center md:justify-self-end" />
    </div>
  );
}

export function StripSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-5 w-40 mb-3" />
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-[74px] shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-5 w-40 mb-3" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-5 w-40 mb-3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
