"use client";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";

interface TechBadgesProps {
  technologies: string[];
}

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default function TechBadges({ technologies }: TechBadgesProps) {
  const { width } = useWindowSize();

  const getVisibleTechCount = () => {
    if (width < 768) {
      return 4; // Mobile
    } else if (width < 1024) {
      return 8; // Medium
    } else {
      return 10; // Desktop
    }
  };

  const visibleTechCount = getVisibleTechCount();
  const visibleTechnologies = technologies.slice(0, visibleTechCount);
  const hiddenTechCount = technologies.length - visibleTechCount;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {visibleTechnologies.map((tech) => (
        <Badge
          key={tech}
          variant="secondary"
          className="p-0.5 text-xs line-clamp-1"
        >
          {tech}
        </Badge>
      ))}
      {hiddenTechCount > 0 && (
        <Badge variant="secondary" className="p-0.5 text-xs line-clamp-1">
          +{hiddenTechCount}
        </Badge>
      )}
    </div>
  );
}