import GitHubProjectsSkeleton from "./GitHubProjectsSkeleton";

export default function GitHubProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <GitHubProjectsSkeleton key={index} />
      ))}
    </div>
  );
}