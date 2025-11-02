import { Skeleton } from "@/components/ui/skeleton";

export default function BioSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
      <div className="w-1/2 mx-auto lg:w-1/3">
        <Skeleton className="mx-auto aspect-square w-[280px] h-[280px] rounded-full" />
      </div>
      <div className="w-full px-4 md:px-8 mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-12 w-3/4" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex space-x-4 mt-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}