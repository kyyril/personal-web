import { Skeleton } from "./ui/skeleton";

export function LoadingMessage() {
  return (
    <div className="flex flex-col gap-y-6 w-full">
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col  w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    </div>
  );
}

export function GuestBookLoadingForm() {
  return (
    <div className="w-full">
      <Skeleton className="h-10 rounded w-full" />
    </div>
  );
}
