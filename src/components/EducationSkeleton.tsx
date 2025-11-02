import { Skeleton } from "@/components/ui/skeleton";

export default function EducationSkeleton() {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      <div className="grid gap-1 relative">
        <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2 dark:bg-gray-50" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}