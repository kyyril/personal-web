import { Skeleton } from "./ui/skeleton";

export function LoadingMessage() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="flex items-center w-full space-x-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="space-y-2 flex flex-col">
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
      <Skeleton className="h-10 rounded-lg w-full" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <Skeleton className="h-[200px] w-[300px] rounded-md my-4" />{" "}
          {/* Skeleton for the image */}
        </div>
        <div className="w-full lg:w-2/3 space-y-3">
          <div className="py-2 px-6">
            <Skeleton className="h-6 w-1/2" /> {/* Skeleton for the title */}
            <div className="flex flex-wrap gap-1 mt-1">
              <Skeleton className="h-6 w-16" />{" "}
              {/* Skeleton for technologies */}
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="py-1">
            <Skeleton className="h-5 w-full" /> {/* Skeleton for description */}
            <Skeleton className="h-5 w-3/4 mt-2" />
          </div>
          <div className="py-2 pb-4 flex space-x-2">
            <Skeleton className="h-10 w-20" /> {/* Skeleton for Demo button */}
            <Skeleton className="h-10 w-20" /> {/* Skeleton for Repo button */}
          </div>
        </div>
      </div>
    </>
  );
}
