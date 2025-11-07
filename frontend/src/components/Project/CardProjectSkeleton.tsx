import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function CardProjectSkeleton() {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4">
          {/* Avatar Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded" />
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
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
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
      </CardHeader>
    </Card>
  );
}
