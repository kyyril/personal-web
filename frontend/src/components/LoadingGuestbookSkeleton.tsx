import { Skeleton } from "./ui/skeleton";

export function LoadingMessage() {
  return (
    <div className="flex flex-col gap-y-6 w-full">
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex items-start w-full space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex flex-col w-full">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

export function GuestBookLoadingForm() {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
