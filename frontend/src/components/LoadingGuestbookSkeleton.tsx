import { Card, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function GuestBookLoadingProfile() {
  return (
    <Card>
      <CardHeader className="flex flex-col w-full">
        <div className="bg-primary-foreground rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="sr-only">Loading profile...</span>
              <div className="w-5 h-5 bg-muted animate-pulse rounded" aria-hidden="true" />
              <div className="h-5 w-32 bg-muted animate-pulse rounded" aria-hidden="true" />
            </h2>
            <div className="h-9 w-24 bg-muted animate-pulse rounded" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>

            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>

            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
              <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Message Form Skeleton */}
        <div className="flex justify-between gap-4 flex-col md:flex-row mt-4" aria-hidden="true">
          <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
    </Card>
  );
}
export function LoadingMessage() {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4" aria-hidden="true">
          {/* Avatar Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-4 md:h-5 w-32 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-1 flex-shrink-0">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>

            {/* Message content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
            </div>

            {/* Reply section skeleton */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
            </div>
          </div>
        </div>
        <span className="sr-only">Loading message content...</span>
      </CardHeader>
    </Card>
  );
}
