"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy MDXRenderer component
const MDXRenderer = dynamic(
    () => import("./MDXRenderer").then((mod) => ({ default: mod.MDXRenderer })),
    {
        loading: () => <MDXRendererSkeleton />,
        ssr: false, // Disable SSR for this heavy component to speed up initial load
    }
);

function MDXRendererSkeleton() {
    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg space-y-6 animate-pulse">
            {/* Simulated paragraph blocks */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
            </div>

            {/* Simulated heading */}
            <Skeleton className="h-8 w-[60%] mt-8" />

            {/* More paragraph blocks */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[98%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-full" />
            </div>

            {/* Simulated code block */}
            <div className="rounded-lg overflow-hidden">
                <div className="bg-secondary px-4 py-2 flex justify-between items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-6" />
                </div>
                <div className="bg-muted p-4 space-y-2">
                    <Skeleton className="h-3 w-[80%]" />
                    <Skeleton className="h-3 w-[60%]" />
                    <Skeleton className="h-3 w-[70%]" />
                    <Skeleton className="h-3 w-[50%]" />
                </div>
            </div>

            {/* Another heading */}
            <Skeleton className="h-7 w-[50%] mt-8" />

            {/* More content */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[88%]" />
            </div>

            {/* Simulated list */}
            <div className="space-y-2 pl-4">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                    <Skeleton className="h-4 w-[85%]" />
                </div>
                <div className="flex items-start gap-3">
                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                    <Skeleton className="h-4 w-[75%]" />
                </div>
                <div className="flex items-start gap-3">
                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                    <Skeleton className="h-4 w-[80%]" />
                </div>
            </div>
        </div>
    );
}

export { MDXRenderer as LazyMDXRenderer, MDXRendererSkeleton };
