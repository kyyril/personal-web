import React from "react";
import { GithubIcon, LinkedinIcon, DocumentIcon } from "./Icons";
import { HERO_DATA } from "../constants";
import { contactInfo } from "@/lib/data";

const SOCIAL_LINKS = [
  { name: "GitHub", url: contactInfo.github, icon: <GithubIcon /> },
  { name: "LinkedIn", url: contactInfo.linkedin, icon: <LinkedinIcon /> },
  { name: "Resume", url: contactInfo.cv, icon: <DocumentIcon /> },
];

const Bio: React.FC = () => {
  return (
    <section>
      <div className="mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Khairil Rahman
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Software Engineer</p>
        </div>
      </div>
      <div className="flex items-center gap-x-6 mb-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground gap-x-2 hover:text-foreground transition-colors duration-300 group font-medium"
            aria-label={link.name}
          >
            {link.icon}
            <span className="hidden md:inline text-sm font-medium">
              {link.name}
            </span>
          </a>
        ))}
      </div>

      <div>
        <p className="max-w-[600px] text-muted-foreground lg:text-lg leading-relaxed">
          Software Engineer specializing in building scalable, maintainable systems. Combining a strong academic foundation in Information Systems with hands-on experience in full-stack development and clean architecture principles.
        </p>
      </div>
    </section>
  );
};

export default Bio;
