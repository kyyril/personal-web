import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ArticleDetailSkeleton() {
  return (
    <div>
      {/* Reading Progress Bar Placeholder */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <Skeleton className="h-full w-1/3 bg-primary/20" />
      </div>

      {/* Breadcrumb Navigation and Back Button */}
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl pt-12">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
          {/* Breadcrumb Navigation */}
          <div className="order-2 sm:order-1">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
              {/* Home */}
              <Skeleton className="h-3 w-8 sm:w-12" />

              {/* Separator */}
              <Skeleton className="h-3 w-3 sm:w-4" />

              {/* Articles */}
              <Skeleton className="h-3 w-14 sm:w-20" />

              {/* Separator */}
              <Skeleton className="h-3 w-3 sm:w-4" />

              {/* Category */}
              <Skeleton className="h-3 w-12 sm:w-20" />

              {/* Separator */}
              <Skeleton className="h-3 w-3 sm:w-4" />

              {/* Article title */}
              <span className="text-foreground font-medium">
                <Skeleton className="h-3 w-12 sm:w-28" />
              </span>
            </nav>
          </div>

          {/* Back Button */}
          <div className="order-1 sm:order-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
              <Skeleton className="h-3 w-8 sm:w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with TOC */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Table of Contents Sidebar - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-16">
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-3 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Article Content */}
          <div className="lg:col-span-3">
            {/* Mobile TOC - Always visible on mobile */}
            <div className="block lg:hidden mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-3 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>

            <article className="mb-8 lg:mb-12">
              {/* Article Header */}
              <header className="mb-6 lg:mb-8">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>

                {/* Title */}
                <Skeleton className="h-8 sm:h-10 lg:h-12 w-full mb-4" />
                <Skeleton className="h-4 sm:h-5 lg:h-6 w-5/6 mb-4" />

                {/* Description */}
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>

                {/* Article Meta Info */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </header>

              {/* Article Content Placeholder */}
              <div className="space-y-4 mb-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    {index % 3 === 0 && (
                      <Skeleton className="h-32 w-full rounded-md" />
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* Comments Section Placeholder */}
            <Card className="mb-8 lg:mb-12">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Posts */}
            <section className="mb-8 lg:mb-12 mt-12">
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <Skeleton className="h-5 w-5 lg:h-6 lg:w-6" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-3 w-2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-4/5" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-8 lg:py-12 bg-secondary/5 rounded-lg mt-8">
              <Skeleton className="h-6 w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-80 mx-auto mb-6" />
              <Skeleton className="h-10 w-32 mx-auto" />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}