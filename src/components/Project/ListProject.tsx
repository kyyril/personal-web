import CardProject from "./CardProject";

interface ListProjectProps {
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    image: string[];
    live_url: string;
    code_repo_url: string;
  }[];
}

export default function ListProject({ projects }: ListProjectProps) {
  return (
    <div className="flex flex-col justify-center">
      <ul className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <li key={project.id}>
            <CardProject project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
