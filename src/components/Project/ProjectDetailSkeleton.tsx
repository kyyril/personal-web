import ProjectImageCarouselSkeleton from "./ProjectImageCarouselSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailSkeleton() {
  return (
    <section className="max-w-5xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <div className="border-none shadow-none">
        {/* Carousel/Image Placeholder */}
        <ProjectImageCarouselSkeleton />

        <div className="flex flex-col mt-6 w-full mx-2 gap-2">
          {/* Title Placeholder */}
          <Skeleton className="h-10 w-3/4" />
          {/* Description Placeholder */}
          <Skeleton className="h-5 w-full mt-2" />
          <Skeleton className="h-5 w-5/6" />

          {/* Technologies Badges Placeholder */}
          <div className="flex flex-wrap gap-1 my-4">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>

          {/* Features List Placeholder */}
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12 mt-1" />
            <Skeleton className="h-5 w-full mt-1" />
          </div>

          {/* Buttons Placeholder */}
          <div className="flex space-x-2 mt-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}