import { Skeleton } from "../ui/skeleton";

export default function ProjectImageCarouselSkeleton() {
  return (
    <div className="relative h-[400px] w-full rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        <Skeleton className="h-2 w-8 rounded-full" />
        <Skeleton className="h-2 w-8 rounded-full" />
        <Skeleton className="h-2 w-8 rounded-full" />
      </div>
    </div>
  );
}
