import { Skeleton } from "./ui/skeleton";

export default function BioSkeleton() {
  return (
    <section>
      <div className="mb-2">
        <div>
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-x-6 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div>
        <Skeleton className="h-5 w-full max-w-[600px] mb-2" />
        <Skeleton className="h-5 w-full max-w-[600px] mb-2" />
        <Skeleton className="h-5 w-5/6 max-w-[600px]" />
      </div>
    </section>
  );
}
