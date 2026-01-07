import { Badge } from "../ui/badge";

interface TechBadgesProps {
  technologies: string[];
}

export default function TechBadges({ technologies }: TechBadgesProps) {
  return (
    <div className="flex flex-nowrap gap-1 mt-2 overflow-hidden items-center no-scrollbar">
      {technologies.map((tech) => (
        <Badge
          key={tech}
          variant="secondary"
          className="px-2 py-0.5 text-[10px] whitespace-nowrap flex-shrink-0 bg-secondary/50 text-muted-foreground border-none font-medium"
        >
          {tech}
        </Badge>
      ))}
    </div>
  );
}