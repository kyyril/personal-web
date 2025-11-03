import CardProjectSkeleton from "./CardProjectSkeleton";

export default function ProjectListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index}>
          <CardProjectSkeleton />
        </li>
      ))}
    </ul>
  );
}