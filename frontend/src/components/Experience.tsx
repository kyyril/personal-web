"use client";
import { Data } from "../lib/interfaces/data";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

function Experience({ data }: { data: Data }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20 grid gap-10">
      {data.experiences.map((ex) => (
        <div
          key={ex.id}
          className="grid gap-1 relative"
        >
          <div className="aspect-square w-3 bg-muted-foreground/30 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-2" />

          <h3 className="text-xl font-semibold text-foreground">{ex.job}</h3>
          <div className="flex flex-row gap-x-2">
            <h4 className="text-foreground/90 font-medium">
              {ex.institution} <span className="text-muted-foreground mx-1">•</span> <span className="text-sm font-normal text-muted-foreground">{ex.status}</span>
            </h4>
          </div>
          <p className="text-muted-foreground text-sm">
            {ex.location} <span className="mx-1">•</span> {ex.working}
          </p>
          <div className="text-sm text-muted-foreground">
            {ex.startDate} - {ex.endDate}
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {ex.description}
          </p>

          {/* Technologies Section */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {ex.technologies
                ?.slice(0, expandedId === ex.id ? undefined : 3)
                .map((tech, index) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full text-custom font-medium"
                  >
                    {tech}
                  </span>
                ))}

              {ex.technologies && ex.technologies.length > 3 && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === ex.id ? null : ex.id)
                    }
                    className="px-2 py-1 h-7 text-xs group"
                    aria-label={`${expandedId === ex.id ? "Show less" : "Show more"
                      } technologies for ${ex.job} position`}
                    aria-expanded={expandedId === ex.id}
                  >
                    {expandedId === ex.id ? (
                      <div className="flex items-center">
                        <span className="sr-only">
                          Show fewer technologies for {ex.job} position
                        </span>
                        Show Less{" "}
                        <ChevronUpIcon
                          className="ml-1 h-3 w-3"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="sr-only">
                          Show {ex.technologies.length - 3} more technologies
                          for {ex.job} position
                        </span>
                        +{ex.technologies.length - 3} More{" "}
                        <ChevronDownIcon
                          className="ml-1 h-3 w-3"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Experience;
