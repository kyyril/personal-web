import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function CardProjectSkeleton() {
  return (
    <Card className="flex flex-col lg:flex-row shadow-none">
      <div className="w-full lg:w-1/3 flex justify-center items-center relative group">
        <Skeleton className="h-[250px] w-full" />
      </div>

      <div className="w-full lg:w-2/3">
        <CardHeader className="py-2 px-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex flex-wrap gap-1 mt-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardHeader>
        <CardContent className="py-1">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter className="py-2 pb-4">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
